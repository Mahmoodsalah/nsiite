import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import crypto from "crypto";

let setupAuth: any, registerAuthRoutes: any, replitIsAuthenticated: RequestHandler | null = null;

try {
  const authModule = require("./replit_integrations/auth");
  setupAuth = authModule.setupAuth;
  registerAuthRoutes = authModule.registerAuthRoutes;
  replitIsAuthenticated = authModule.isAuthenticated;
} catch (e) {
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Mahmood@2025";

function simpleSessionAuth(): RequestHandler {
  return (req: any, res, next) => {
    if (req.session?.adminAuthenticated) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
}

const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (req.session?.adminAuthenticated) {
    return next();
  }

  if (replitIsAuthenticated) {
    return replitIsAuthenticated(req, res, next);
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
  app: Express
): Promise<Server> {
  if (setupAuth) {
    try {
      await setupAuth(app);
      registerAuthRoutes(app);
    } catch (e) {
      console.log("Replit Auth not available, using simple auth only");
    }
  }

  app.post("/api/admin/login", (req: any, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.adminAuthenticated = true;
      req.session.save(() => {
        res.json({
          id: "admin",
          email: "admin@local",
          firstName: "Admin",
          lastName: "",
          profileImageUrl: null,
        });
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", (req: any, res) => {
    req.session.adminAuthenticated = false;
    req.session.save(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", (req: any, res) => {
    if (req.session?.adminAuthenticated) {
      return res.json({
        id: "admin",
        email: "admin@local",
        firstName: "Admin",
        lastName: "",
        profileImageUrl: null,
      });
    }

    if (req.isAuthenticated?.() && req.user) {
      const userId = req.user.claims?.sub;
      if (userId) {
        return res.json(req.user);
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  });

  app.get("/api/content/:page", async (req, res) => {
    try {
      const content = await storage.getContentByPage(req.params.page);
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

  app.delete("/api/content/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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
