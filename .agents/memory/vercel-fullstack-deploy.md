---
name: Vercel deploy of Vite + Express (full-stack JS) app
description: Non-obvious Vercel quirks that broke this app's serverless API and Blob storage on deploy.
---

# Deploying this Vite client + Express server app to Vercel

The app builds the client with Vite and bundles the Express server with esbuild. On
Vercel the server runs as a single serverless function in `api/`. Three non-obvious
quirks each broke the deploy in turn:

## 1. Vercel detects functions BEFORE running the build
Vercel scans the `api/` folder during preparation, before `npm run build` runs. If
`api/` is empty in git (e.g. the entry file is gitignored and only generated at build
time), Vercel concludes there are no functions and serves static only → every `/api/*`
returns 404.
**How to apply:** commit a small placeholder entry file in `api/` so Vercel detects the
function; the build step overwrites it with the real bundle during deployment.

## 2. Vercel does NOT auto-detect `.cjs` as a serverless function
Auto-detection only covers `.js`, `.ts`, `.mjs`. A `.cjs` entry is ignored.
**Why:** the project's root `package.json` has `"type": "module"`, so a plain `.js`
CommonJS bundle would be parsed as ESM and fail.
**How to apply:** output the bundle to `api/index.js` AND add `api/package.json` with
`{"type":"commonjs"}` so Node treats `.js` in that folder as CommonJS, overriding the
root module type.

## 3. Vercel Blob: "Cannot use public access on a private store"
The storage code calls `put(..., { access: "public" })` and reads blobs via their public
URL. That requires the Blob store to be created as **Public**. A Private store throws
`BlobError: Cannot use public access on a private store`.
**How to apply:** for public CMS content, create the Blob store as Public. Private store
would require an authenticated download path in code instead of fetching the public URL.

## General
- Any env var change (add/delete/value) needs a **Redeploy** — Vercel injects env vars at
  build time, not at runtime. Missing vars fall back to in-code defaults silently.
- When debugging from runtime logs, check the log timestamps against the new build's
  completion time — stale logs from the previous deployment are a common false alarm.
