---
name: Adding a new CMS-editable section to this portfolio site
description: How to add page content that is automatically editable in the /admin panel without touching admin.tsx.
---

# Adding a new editable CMS section

Content lives in `data/content.json` as a flat array of `{id, page, section, contentKey, value}`
items (served per-page via `GET /api/content/:page`, read on the frontend with
`usePageContent(page)` + `getVal(content, section, key, fallback)`).

To add a NEW editable section to a page, you usually only edit `data/content.json` and the
page component — **not** `admin.tsx`:

- The admin panel (`client/src/pages/admin.tsx`) auto-renders every content item for the active
  page, grouped by `section` via `groupContent`. Strings → `StringEditor`, string arrays →
  `StringArrayEditor`, arrays of objects → `ObjectArrayEditor` (its "Add" button clones the first
  item as a blank template; the collapsed row title comes from `item.title || name || label ||
  platform`). So include a `name`/`title` field in object items for a readable admin label.
- The only admin requirement: the section key must exist in `SECTION_LABELS` in `admin.tsx` for a
  friendly heading. Many common keys (incl. `testimonials`) already exist; if missing, add one
  line there.

**Why:** the generic renderer means new content is editable for free — re-implementing per-section
admin forms is wasted work.

**How to apply:** give new items unique `id`s (compute max existing id + 1), keep the JSON valid
(`node -e "JSON.parse(...)"`), and read them in the page with `getVal`. New keys added in code are
auto-merged into the Vercel Blob on next read via `mergeSeedKeys`, so deployed edits aren't lost.
For Arabic/RTL content, set `dir="rtl"` + `text-right` on the rendering container.
