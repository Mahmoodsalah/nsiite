import type { Express, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { pool } from "./db";
import { registerUploadRoute } from "./upload";
import { ensureAdminSeeded, verifyCredentials, updateAdminCredentials } from "./admin-auth";

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
  app: Express
): Promise<Server> {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const isProd = process.env.NODE_ENV === "production";

  let sessionStore: session.Store | undefined;
  if (process.env.DATABASE_URL) {
    const PgSession = connectPgSimple(session);
    sessionStore = new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    });
  }

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "admin-secret-key-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: sessionTtl,
      },
    })
  );

  await ensureAdminSeeded();

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
      req.session.adminAuthenticated = true;
      req.session.adminUserId = user.id;
      req.session.adminUsername = user.username;
      req.session.save((err: any) => {
        if (err) return res.status(500).json({ message: "Failed to save session" });
        res.json({
          id: "admin",
          username: user.username,
          email: "admin@local",
          firstName: user.username || "Admin",
          lastName: "",
          profileImageUrl: null,
        });
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req: any, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
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

  const changeCredentialsSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newUsername: z
      .string()
      .transform((v) => v.trim())
      .pipe(
        z
          .string()
          .min(3, "Username must be at least 3 characters")
          .max(100)
          .regex(/^[A-Za-z0-9._-]+$/, "Username may only contain letters, numbers, '.', '_' or '-'"),
      ),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(200)
      .optional()
      .or(z.literal("")),
  });

  app.post("/api/admin/change-credentials", isAuthenticated, async (req: any, res) => {
    try {
      const parsed = changeCredentialsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: parsed.error.issues[0]?.message || "Invalid input" });
      }
      const userId = req.session.adminUserId;
      if (typeof userId !== "number") {
        return res.status(401).json({ message: "Session missing user id, please re-login" });
      }
      const { currentPassword, newUsername, newPassword } = parsed.data;
      const passwordChanged = !!(newPassword && newPassword.length > 0);
      const result = await updateAdminCredentials(
        userId,
        currentPassword,
        newUsername,
        passwordChanged ? newPassword! : null,
      );
      if (!result.ok) {
        return res.status(400).json({ message: result.error });
      }

      // Regenerate session id to defend against session-fixation after a credential change.
      req.session.regenerate((regenErr: any) => {
        if (regenErr) {
          console.error("Session regenerate error:", regenErr);
          return res.status(500).json({ message: "Failed to refresh session" });
        }
        req.session.adminAuthenticated = true;
        req.session.adminUserId = userId;
        req.session.adminUsername = newUsername;
        req.session.save((saveErr: any) => {
          if (saveErr) return res.status(500).json({ message: "Failed to save session" });
          res.json({ success: true, username: newUsername, passwordChanged });
        });
      });
    } catch (err) {
      console.error("Change credentials error:", err);
      res.status(500).json({ message: "Failed to update credentials" });
    }
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
