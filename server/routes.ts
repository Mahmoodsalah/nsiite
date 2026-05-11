import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { registerUploadRoute } from "./upload";
import { verifyCredentials } from "./admin-auth";
import { cookieSession } from "./session";

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

const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.adminAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

const updateContentSchema = z.object({
  page: z.string().min(1).max(50),
  section: z.string().min(1).max(100),
  contentKey: z.string().min(1).max(100),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.any()), z.record(z.any())]),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
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
