import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { registerUploadRoute } from "./upload";
import { verifyCredentials } from "./admin-auth";
import { cookieSession } from "./session";

const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.adminAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

const contentValueSchema = z.union([z.string(), z.number(), z.boolean(), z.array(z.any()), z.record(z.any())]);

const updateContentSchema = z.object({
  page: z.string().min(1).max(50),
  section: z.string().min(1).max(100),
  contentKey: z.string().min(1).max(100),
  value: contentValueSchema,
});

const contentFileSchema = z
  .array(
    z.object({
      id: z.number().int(),
      page: z.string().min(1).max(50),
      section: z.string().min(1).max(100),
      contentKey: z.string().min(1).max(100),
      value: contentValueSchema,
    }),
  )
  .min(1)
  .refine((items) => new Set(items.map((i) => i.id)).size === items.length, {
    message: "Duplicate ids",
  });

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  if (process.env.NODE_ENV === "production") {
    const required = ["SESSION_SECRET"];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      throw new Error(
        `Refusing to start in production: missing required env vars ${missing.join(", ")}. ` +
          "Set these in your hosting provider before deploying.",
      );
    }
  }

  app.use(cookieSession());

  app.post("/api/admin/login", async (req: any, res) => {
    try {
      const { username, password } = req.body ?? {};
      if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const user = await verifyCredentials(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      req.setSession({
        adminAuthenticated: true,
        adminUsername: user.username,
      });
      res.json({
        id: "admin",
        username: user.username,
        email: "admin@local",
        firstName: user.username || "Admin",
        lastName: "",
        profileImageUrl: null,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req: any, res) => {
    req.setSession(null);
    res.json({ success: true });
  });

  app.get("/api/auth/user", (req: any, res) => {
    if (req.session?.adminAuthenticated) {
      const username = req.session.adminUsername || "admin";
      return res.json({
        id: "admin",
        username,
        email: "admin@local",
        firstName: username,
        lastName: "",
        profileImageUrl: null,
      });
    }
    return res.status(401).json({ message: "Unauthorized" });
  });

  app.get("/api/content/:page", async (req, res) => {
    try {
      const content = await storage.getContentByPage(req.params.page as string);
      const result: Record<string, Record<string, any>> = {};
      for (const item of content) {
        if (!result[item.section]) result[item.section] = {};
        result[item.section][item.contentKey] = item.value;
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content", async (_req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching all content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.put("/api/content", isAuthenticated, async (req, res) => {
    try {
      const parsed = updateContentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid request", errors: parsed.error.flatten() });
      }
      const { page, section, contentKey, value } = parsed.data;
      const result = await storage.upsertContent(page, section, contentKey, value);
      res.json(result);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  registerUploadRoute(app, isAuthenticated);

  app.get("/api/admin/backups", isAuthenticated, async (_req, res) => {
    try {
      res.json(await storage.listBackups());
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  app.get("/api/admin/backups/:id", isAuthenticated, async (req, res) => {
    try {
      const id = req.params.id as string;
      const data = await storage.getBackup(id);
      if (!data) return res.status(404).json({ message: "Backup not found" });
      res.setHeader("Content-Disposition", `attachment; filename="${id}"`);
      res.json(data);
    } catch (error) {
      console.error("Error reading backup:", error);
      res.status(500).json({ message: "Failed to read backup" });
    }
  });

  app.post("/api/admin/backups/:id/restore", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getBackup(req.params.id as string);
      if (!data) return res.status(404).json({ message: "Backup not found" });
      const parsed = contentFileSchema.safeParse(data);
      if (!parsed.success) return res.status(422).json({ message: "Backup file is not valid content" });
      await storage.restoreContent(parsed.data);
      res.json({ success: true, items: parsed.data.length });
    } catch (error) {
      console.error("Error restoring backup:", error);
      res.status(500).json({ message: "Failed to restore backup" });
    }
  });

  app.post("/api/admin/restore", isAuthenticated, async (req, res) => {
    try {
      const parsed = contentFileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "This file is not a valid content backup" });
      }
      await storage.restoreContent(parsed.data);
      res.json({ success: true, items: parsed.data.length });
    } catch (error) {
      console.error("Error restoring content:", error);
      res.status(500).json({ message: "Failed to restore content" });
    }
  });

  app.delete("/api/content/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      await storage.deleteContent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  return httpServer;
}
