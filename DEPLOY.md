# Deploying to Vercel (free Hobby plan)

This guide covers deploying the site to Vercel with the custom domain `mahmoodsalah.xyz`.

## 1. Prerequisites

- A free [Vercel](https://vercel.com) account
- A free Postgres database (recommended: [Neon](https://neon.tech) — Vercel integrates natively)
- The project pushed to a GitHub repository

## 2. Provision a Postgres database

1. Sign up at [neon.tech](https://neon.tech) and create a new project
2. Copy the **connection string** (it looks like `postgresql://user:pass@host/dbname?sslmode=require`)
3. Keep this string handy — you'll paste it into Vercel as `DATABASE_URL`

## 3. Seed the database with current content

From your local machine (or Replit), with `DATABASE_URL` pointed at the new Neon database:

```bash
npm run db:push          # creates the site_content table
npx tsx server/seed.ts   # imports every entry from data/content.json
```

You should see `Seeding complete. Inserted: ~186, Updated: 0` on a fresh database (the exact count grows over time as more content is added).

## 4. Connect the GitHub repo to Vercel

1. Push the project to GitHub
2. In Vercel: **New Project → Import Git Repository → select your repo**
3. Vercel auto-detects the `vercel.json` config — leave the defaults

## 5. Set environment variables in Vercel

Go to **Project Settings → Environment Variables** and add:

| Variable          | Value                                                          | Environment    |
|-------------------|----------------------------------------------------------------|----------------|
| `DATABASE_URL`    | Your Neon connection string                                    | Production     |
| `SESSION_SECRET`  | A long random string (e.g. `openssl rand -hex 32`)             | Production     |
| `ADMIN_USERNAME`  | Your admin username (default: `admin`)                         | Production     |
| `ADMIN_PASSWORD`  | A strong password (replace the default `Mahmood@2025`)         | Production     |
| `NODE_ENV`        | `production`                                                   | Production     |

Click **Save**, then trigger a redeploy.

## 6. Attach the custom domain

1. In Vercel: **Project Settings → Domains → Add `mahmoodsalah.xyz`**
2. Vercel will show DNS records to add at your domain registrar
3. After DNS propagates (a few minutes to a few hours), HTTPS is automatic

## 7. Verify everything works

- Visit `https://mahmoodsalah.xyz` — homepage should load
- Visit `https://mahmoodsalah.xyz/admin` — log in with your `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- Edit a piece of content and click Save — the change should appear instantly on the public pages
- Check `/sitemap.xml` and `/robots.txt` — both should return content

## Future updates

- **Code changes**: push to GitHub; Vercel auto-deploys
- **Content changes**: edit at `/admin` on the live site; saves immediately, no rebuild
- **Adding a new "Worked With" logo image**: put the PNG into `client/public/logos/` in the repo, push to GitHub, then reference it as `/logos/yourfile.png` in the admin panel

## Troubleshooting

- **"Failed to update content"**: check `DATABASE_URL` is set correctly in Vercel env vars
- **Logged out immediately after login**: ensure `SESSION_SECRET` is set and `NODE_ENV=production` is set
- **Logos missing**: confirm files exist in `client/public/logos/` and were committed to git
