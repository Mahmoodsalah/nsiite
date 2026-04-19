import type { Express, RequestHandler } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error("Unsupported file type. Use PNG, JPG, GIF, WEBP, SVG, or ICO."));
  },
});

function sanitizeBase(name: string): string {
  const base = path.basename(name, path.extname(name));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "upload";
}

const ALLOWED_EXTS = new Set(Object.values(EXT_BY_MIME));

function extFor(file: Express.Multer.File): string {
  const fromName = path.extname(file.originalname).toLowerCase();
  if (fromName && ALLOWED_EXTS.has(fromName)) return fromName;
  return EXT_BY_MIME[file.mimetype] || "";
}

async function saveToVercelBlob(
  file: Express.Multer.File,
  filename: string,
): Promise<string> {
  const { put } = await import("@vercel/blob");
  const result = await put(`uploads/${filename}`, file.buffer, {
    access: "public",
    contentType: file.mimetype,
    addRandomSuffix: false,
  });
  return result.url;
}

function saveToDisk(file: Express.Multer.File, filename: string): string {
  const dir = path.resolve(process.cwd(), "client", "public", "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), file.buffer);
  return `/uploads/${filename}`;
}

export function registerUploadRoute(app: Express, isAuthenticated: RequestHandler) {
  app.post(
    "/api/admin/upload",
    isAuthenticated,
    (req, res, next) => {
      upload.single("file")(req, res, (err: any) => {
        if (err) {
          const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
          return res.status(status).json({ message: err.message || "Upload failed" });
        }
        next();
      });
    },
    async (req, res) => {
      try {
        const file = (req as any).file as Express.Multer.File | undefined;
        if (!file) return res.status(400).json({ message: "No file provided" });

        const ext = extFor(file);
        const base = sanitizeBase(file.originalname);
        const filename = `${Date.now()}-${base}${ext}`;

        const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
        const url = useBlob
          ? await saveToVercelBlob(file, filename)
          : saveToDisk(file, filename);

        res.json({ url, filename, size: file.size, contentType: file.mimetype });
      } catch (err: any) {
        console.error("Upload error:", err);
        res.status(500).json({ message: err?.message || "Upload failed" });
      }
    },
  );
}
