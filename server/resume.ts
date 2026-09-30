import type { Express, RequestHandler } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { storage } from "./storage";
import { sanitizeBase } from "./upload";

// Vercel rejects serverless request bodies over 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;
const BLOB_PREFIX = "resume/";
const LOCAL_DIR = path.resolve(process.cwd(), "client", "public", "uploads", "resume");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new Error("Please upload a PDF file."));
  },
});

// Stores the new CV, points the Hire Me page at it, then deletes older CVs.
// Old files are removed only after the page has been updated, so the page
// never links to a missing file.
async function saveResume(file: Express.Multer.File): Promise<{ url: string; deleted: number }> {
  const filename = `${Date.now()}-${sanitizeBase(file.originalname)}.pdf`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put, list, del } = await import("@vercel/blob");
    const { url } = await put(BLOB_PREFIX + filename, file.buffer, {
      access: "public",
      contentType: "application/pdf",
      addRandomSuffix: false,
    });
    await storage.upsertContent("hireme", "resume", "pdfUrl", url);
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    const old = blobs.filter((b) => b.url !== url).map((b) => b.url);
    if (old.length) await del(old);
    return { url, deleted: old.length };
  }

  fs.mkdirSync(LOCAL_DIR, { recursive: true });
  fs.writeFileSync(path.join(LOCAL_DIR, filename), file.buffer);
  const url = `/uploads/resume/${filename}`;
  await storage.upsertContent("hireme", "resume", "pdfUrl", url);
  const old = fs.readdirSync(LOCAL_DIR).filter((f) => f !== filename);
  for (const f of old) fs.rmSync(path.join(LOCAL_DIR, f), { force: true });
  return { url, deleted: old.length };
}

export function registerResumeRoute(app: Express, isAuthenticated: RequestHandler) {
  app.post(
    "/api/admin/resume",
    isAuthenticated,
    (req, res, next) => {
      upload.single("file")(req, res, (err: any) => {
        if (err) {
          const tooBig = err.code === "LIMIT_FILE_SIZE";
          return res.status(tooBig ? 413 : 400).json({
            message: tooBig ? "The PDF is larger than 4 MB. Please export a smaller file." : err.message || "Upload failed",
          });
        }
        next();
      });
    },
    async (req, res) => {
      try {
        const file = (req as any).file as Express.Multer.File | undefined;
        if (!file) return res.status(400).json({ message: "No file provided" });
        if (file.buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
          return res.status(400).json({ message: "This file doesn't look like a valid PDF." });
        }
        res.json(await saveResume(file));
      } catch (err: any) {
        console.error("Resume upload error:", err);
        res.status(500).json({ message: err?.message || "Upload failed" });
      }
    },
  );
}
