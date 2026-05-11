import crypto from "crypto";
import type { Request, Response, NextFunction, RequestHandler } from "express";

const COOKIE_NAME = "ms_admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  adminAuthenticated?: boolean;
  adminUsername?: string;
  exp?: number;
}

declare module "express-serve-static-core" {
  interface Request {
    session: SessionData;
    setSession: (data: SessionData | null) => void;
  }
}

function getSecret(): string {
  return process.env.SESSION_SECRET || "admin-secret-key-change-me";
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(payload: string): string {
  return b64urlEncode(crypto.createHmac("sha256", getSecret()).update(payload).digest());
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function encodeCookie(data: SessionData): string {
  const payload = b64urlEncode(Buffer.from(JSON.stringify(data), "utf-8"));
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decodeCookie(value: string): SessionData | null {
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!timingSafeEq(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(b64urlDecode(payload).toString("utf-8")) as SessionData;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    if (data.adminAuthenticated !== true) return null;
    return data;
  } catch {
    return null;
  }
}

function parseCookieHeader(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export function cookieSession(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookies = parseCookieHeader(req.headers.cookie);
    const raw = cookies[COOKIE_NAME];
    req.session = (raw && decodeCookie(raw)) || {};

    req.setSession = (data: SessionData | null) => {
      const isProd = process.env.NODE_ENV === "production";
      const flags = [
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        ...(isProd ? ["Secure"] : []),
      ];
      if (!data) {
        res.setHeader(
          "Set-Cookie",
          `${COOKIE_NAME}=; Max-Age=0; ${flags.join("; ")}`,
        );
        req.session = {};
        return;
      }
      const withExp: SessionData = { ...data, exp: Date.now() + MAX_AGE_MS };
      const value = encodeCookie(withExp);
      res.setHeader(
        "Set-Cookie",
        `${COOKIE_NAME}=${value}; Max-Age=${Math.floor(MAX_AGE_MS / 1000)}; ${flags.join("; ")}`,
      );
      req.session = withExp;
    };

    next();
  };
}
