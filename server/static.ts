import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { getAppShell, pageHandler } from "./seo";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // every other route gets the app shell with that page's SEO tags
  app.use(pageHandler(() => getAppShell() ?? fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8")));
}
