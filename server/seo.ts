import type { Request, RequestHandler } from "express";
import { storage } from "./storage";

// The built client index.html, embedded into the server bundle by
// script/build.ts. Undefined when running from source (dev).
declare const __APP_SHELL__: string | undefined;

export function getAppShell(): string | undefined {
  return typeof __APP_SHELL__ === "string" ? __APP_SHELL__ : undefined;
}

type PageSeoSource = { page: string; section: string; defaultImage?: string };

// Which CMS section holds the SEO fields for each client route. Keep in sync
// with the routes in client/src/App.tsx and each page's getVal() calls.
const PAGE_SEO: Record<string, PageSeoSource> = {
  "/": { page: "home", section: "seoHome" },
  "/hire-me": { page: "hireme", section: "seoHireMe" },
  "/automati": { page: "automati", section: "seo" },
  "/bootcampai": { page: "bootcamp", section: "seo", defaultImage: "/logos/bootcampai.png" },
  "/mentorship": { page: "mentorship", section: "seo" },
  "/consultation": { page: "consultation", section: "seo" },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function setMeta(html: string, attr: "name" | "property", key: string, value: string | undefined): string {
  if (!value) return html;
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(/[.:]/g, "\\$&")}"\\s+content=")[^"]*(")`);
  return html.replace(re, (_m, pre, post) => pre + escapeHtml(value) + post);
}

function absoluteUrl(url: string, origin: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return origin + (url.startsWith("/") ? url : `/${url}`);
}

function requestOrigin(req: Request): string {
  const proto = (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] || req.protocol;
  const host = (req.headers["x-forwarded-host"] as string | undefined) || req.headers.host;
  return `${proto}://${host}`;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

// Rewrites the shell's <head> tags for the requested route so link previews
// (WhatsApp, LinkedIn, Facebook, X) and crawlers that don't run JavaScript see
// the page's own title, description and image instead of the home page's.
export async function renderPageHtml(shell: string, pathname: string, origin: string): Promise<string> {
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (route === "/admin") {
    return setMeta(shell, "name", "robots", "noindex, nofollow");
  }

  const source = PAGE_SEO[route];
  if (!source) return shell;

  const items = await storage.getContentByPage(source.page);
  const seo: Record<string, unknown> = {};
  for (const item of items) {
    if (item.section === source.section) seo[item.contentKey] = item.value;
  }

  const title = str(seo.title);
  const description = str(seo.description);
  const canonical = str(seo.canonicalUrl);
  const imageSrc = str(seo.ogImage) || source.defaultImage;
  const image = imageSrc ? absoluteUrl(imageSrc, origin) : undefined;

  let html = shell;
  if (title) html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, "name", "description", description);
  html = setMeta(html, "name", "keywords", str(seo.keywords));
  if (canonical) {
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, (_m, pre, post) => pre + escapeHtml(canonical) + post);
  }
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "property", "og:description", description);
  html = setMeta(html, "property", "og:url", canonical);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "property", "og:image:alt", title);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "name", "twitter:description", description);
  html = setMeta(html, "name", "twitter:image", image);
  return html;
}

// Serves the SPA shell for client routes, with per-page SEO tags filled in.
export function pageHandler(getShell: () => Promise<string> | string): RequestHandler {
  return async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api/") || req.path === "/api") return next();

    let shell: string;
    try {
      shell = await getShell();
    } catch (err) {
      return next(err);
    }

    let html = shell;
    try {
      html = await renderPageHtml(shell, req.path, requestOrigin(req));
    } catch (err) {
      // Fall back to the default tags rather than failing the page.
      console.error("[seo] Failed to render page tags:", err);
    }

    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      // Let Vercel's CDN reuse the page for a minute so most visits don't
      // invoke the function; admin SEO edits show up within that window.
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
    });
    res.end(html);
  };
}
