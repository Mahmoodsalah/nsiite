import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { adminUsers, type AdminUser } from "@shared/schema";

const SALT_ROUNDS = 10;
const useDb = !!process.env.DATABASE_URL;
const isProd = process.env.NODE_ENV === "production";

if (isProd && !useDb) {
  throw new Error(
    "[admin-auth] FATAL: NODE_ENV=production requires DATABASE_URL. " +
      "Refusing to fall back to env-var/plaintext auth in production.",
  );
}

export async function ensureAdminSeeded(): Promise<void> {
  if (!useDb) return;

  const envUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const envPassword = process.env.ADMIN_PASSWORD || "Mahmood@2025";

  if (isProd && !process.env.ADMIN_PASSWORD) {
    console.warn(
      "[admin-auth] WARNING: ADMIN_PASSWORD env var is not set in production. " +
        "If admin_users is empty, the default seed password will be used — " +
        "change it immediately via /admin → Account.",
    );
  }

  try {
    const existing = await db.select().from(adminUsers).limit(1);
    if (existing.length > 0) return;

    const passwordHash = await bcrypt.hash(envPassword, SALT_ROUNDS);
    await db.insert(adminUsers).values({
      username: envUsername,
      passwordHash,
    });
    console.log(`[admin-auth] Seeded initial admin user "${envUsername}" from env vars`);
  } catch (err) {
    console.error("[admin-auth] Failed to seed initial admin:", err);
    if (isProd) {
      throw err;
    }
  }
}

export async function findAdminByUsername(username: string): Promise<AdminUser | null> {
  if (!useDb) return null;
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);
  return rows[0] ?? null;
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  if (!useDb) {
    if (isProd) return null;
    const envUsername = (process.env.ADMIN_USERNAME || "admin").trim();
    const envPassword = process.env.ADMIN_PASSWORD || "Mahmood@2025";
    if (username === envUsername && password === envPassword) {
      return { id: 0, username, passwordHash: "", updatedAt: new Date() };
    }
    return null;
  }

  const user = await findAdminByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function updateAdminCredentials(
  currentUserId: number,
  currentPassword: string,
  newUsername: string,
  newPassword: string | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!useDb) return { ok: false, error: "Account settings require a database (Postgres). Set DATABASE_URL and redeploy." };

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, currentUserId)).limit(1);
  const user = rows[0];
  if (!user) return { ok: false, error: "User not found" };

  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) return { ok: false, error: "Current password is incorrect" };

  if (newUsername !== user.username) {
    const conflict = await findAdminByUsername(newUsername);
    if (conflict && conflict.id !== currentUserId) {
      return { ok: false, error: "Username is already taken" };
    }
  }

  const passwordHash = newPassword
    ? await bcrypt.hash(newPassword, SALT_ROUNDS)
    : user.passwordHash;

  await db.update(adminUsers).set({
    username: newUsername,
    passwordHash,
    updatedAt: new Date(),
  }).where(eq(adminUsers.id, currentUserId));

  return { ok: true };
}
