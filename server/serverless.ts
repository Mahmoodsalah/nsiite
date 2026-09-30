import type { IncomingMessage, ServerResponse } from "http";
import { createApp } from "./app";
import { getAppShell, pageHandler } from "./seo";

const appPromise = createApp().then(({ app }) => {
  // Vercel rewrites every page route here (see vercel.json) so each page gets
  // its own SEO tags; static files are served by the CDN before this runs.
  app.use(pageHandler(() => getAppShell()!));
  return app;
});
// The handler reports startup failures per request; without this, the early
// rejection would be unhandled and crash the function before any request.
appPromise.catch(() => {});

module.exports = async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  let app;
  try {
    app = await appPromise;
  } catch (err) {
    // Keep public pages up even if the API can't start (e.g. a missing env var).
    console.error("App failed to start:", err);
    const shell = getAppShell();
    const isApi = (req.url || "").startsWith("/api");
    res.statusCode = shell && !isApi ? 200 : 500;
    res.setHeader("Content-Type", shell && !isApi ? "text/html; charset=utf-8" : "application/json");
    res.end(shell && !isApi ? shell : JSON.stringify({ message: "Server failed to start" }));
    return;
  }
  (app as any)(req, res);
};
