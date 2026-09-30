import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  // The server embeds index.html and renders it with per-page SEO tags, so
  // the file is removed from the static output: otherwise Vercel's CDN would
  // serve it for "/" without ever calling the function.
  const appShell = await readFile("dist/public/index.html", "utf-8");
  await rm("dist/public/index.html");
  const define = {
    "process.env.NODE_ENV": '"production"',
    __APP_SHELL__: JSON.stringify(appShell),
  };

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define,
    minify: true,
    external: externals,
    logLevel: "info",
  });

  console.log("building serverless function for vercel...");
  await esbuild({
    entryPoints: ["server/serverless.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "api/index.js",
    define,
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
