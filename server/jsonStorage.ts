import fs from "fs";
import path from "path";
import seedData from "../data/content.json" with { type: "json" };

export interface SiteContentItem {
  id: number;
  page: string;
  section: string;
  contentKey: string;
  value: any;
}

const DATA_FILE = path.join(process.cwd(), "data", "content.json");
const BLOB_PATH = "cms/content.json";
const BACKUP_DIR = path.join(process.cwd(), "data", "backups");
const BACKUP_PREFIX = "cms/backups/";
// One automatic restore point per editing session keeps a burst of saves from
// pushing every older backup out of the retention window.
const BACKUP_INTERVAL_MS = 10 * 60_000;
const MAX_BACKUPS = 30;
const BACKUP_ID_REGEX = /^content-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)-(auto|restore|migration)\.json$/;
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

let cache: SiteContentItem[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5_000;

function ensureLocalDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// A page can ship a content version in `<page>/_meta/version`. When the seed's
// version is newer than the stored one, that page's stored content is replaced
// by the seed (a backup is taken first). Otherwise only missing keys are added,
// so edits made in /admin are never overwritten.
function pageVersion(items: SiteContentItem[], page: string): number {
  const meta = items.find((i) => i.page === page && i.section === "_meta" && i.contentKey === "version");
  return meta ? Number(meta.value) || 0 : 0;
}

export function mergeSeedKeys(stored: SiteContentItem[]): {
  merged: SiteContentItem[];
  changed: boolean;
  replacedPages: string[];
} {
  const seed = seedData as SiteContentItem[];
  const versionedPages = Array.from(
    new Set(seed.filter((i) => i.section === "_meta" && i.contentKey === "version").map((i) => i.page)),
  );
  const replacedPages = versionedPages.filter((page) => pageVersion(stored, page) < pageVersion(seed, page));
  const existing = replacedPages.length
    ? stored.filter((i) => !replacedPages.includes(i.page))
    : stored;

  const key = (i: SiteContentItem) => `${i.page}::${i.section}::${i.contentKey}`;
  const have = new Set(existing.map(key));
  let nextId = existing.length
    ? Math.max(...existing.map((i) => i.id)) + 1
    : 1;
  const additions: SiteContentItem[] = [];
  for (const item of seed) {
    if (!have.has(key(item))) {
      additions.push({ ...item, id: nextId++ });
    }
  }
  return additions.length || replacedPages.length
    ? { merged: [...existing, ...additions], changed: true, replacedPages }
    : { merged: existing, changed: false, replacedPages };
}

async function readFromBlob(): Promise<SiteContentItem[]> {
  const { head, BlobNotFoundError } = await import("@vercel/blob");
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Blob fetch ${res.status}`);
    const data = (await res.json()) as SiteContentItem[];
    const { merged, changed, replacedPages } = mergeSeedKeys(data);
    if (replacedPages.length) {
      try {
        await backupBeforeChange(data, "migration");
      } catch (err) {
        // Never replace content without a backup; serve it as-is and retry later.
        console.error("[storage] Skipping content update, backup failed:", err);
        return data;
      }
      console.log(`[storage] Updated content for page(s): ${replacedPages.join(", ")}`);
    }
    if (changed) await writeToBlob(merged);
    return merged;
  } catch (err: any) {
    if (err instanceof BlobNotFoundError || err?.name === "BlobNotFoundError") {
      const seed = seedData as SiteContentItem[];
      await writeToBlob(seed);
      return seed;
    }
    throw err;
  }
}

async function writeToBlob(data: SiteContentItem[]): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

function readFromDisk(): SiteContentItem[] {
  ensureLocalDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedData, null, 2), "utf-8");
    return seedData as SiteContentItem[];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as SiteContentItem[];
}

function writeToDisk(data: SiteContentItem[]) {
  ensureLocalDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function readData(): Promise<SiteContentItem[]> {
  if (cache && Date.now() - cacheTime < CACHE_TTL_MS) return cache;
  const data = useBlob ? await readFromBlob() : readFromDisk();
  cache = data;
  cacheTime = Date.now();
  return data;
}

async function writeData(data: SiteContentItem[]): Promise<void> {
  if (useBlob) {
    await writeToBlob(data);
  } else {
    writeToDisk(data);
  }
  cache = data;
  cacheTime = Date.now();
}

export type BackupReason = "auto" | "restore" | "migration";

export interface BackupInfo {
  id: string;
  createdAt: string;
  reason: BackupReason;
  size: number;
}

let lastBackupAt = 0;

function parseBackupId(id: string): { createdAt: string; reason: BackupReason } | null {
  const m = BACKUP_ID_REGEX.exec(id);
  if (!m) return null;
  const [date, time] = m[1].split("T");
  const [hh, mm, ss, ms] = time.replace("Z", "").split("-");
  return { createdAt: `${date}T${hh}:${mm}:${ss}.${ms}Z`, reason: m[2] as BackupReason };
}

async function listBackupFiles(): Promise<(BackupInfo & { url?: string })[]> {
  const out: (BackupInfo & { url?: string })[] = [];
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: BACKUP_PREFIX, cursor });
      for (const b of page.blobs) {
        const id = b.pathname.slice(BACKUP_PREFIX.length);
        const meta = parseBackupId(id);
        if (meta) out.push({ id, ...meta, size: b.size, url: b.url });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  } else if (fs.existsSync(BACKUP_DIR)) {
    for (const id of fs.readdirSync(BACKUP_DIR)) {
      const meta = parseBackupId(id);
      if (meta) out.push({ id, ...meta, size: fs.statSync(path.join(BACKUP_DIR, id)).size });
    }
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Deletes all but the newest `keep` backups in `existing` (sorted newest first).
async function pruneBackups(existing: (BackupInfo & { url?: string })[], keep: number) {
  const stale = existing.slice(keep);
  if (stale.length === 0) return;
  if (useBlob) {
    const { del } = await import("@vercel/blob");
    await del(stale.map((b) => b.url!));
  } else {
    for (const b of stale) fs.rmSync(path.join(BACKUP_DIR, b.id), { force: true });
  }
}

async function writeBackup(data: SiteContentItem[], reason: BackupReason): Promise<void> {
  const now = new Date();
  const id = `content-${now.toISOString().replace(/[:.]/g, "-")}-${reason}.json`;
  const body = JSON.stringify(data, null, 2);
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BACKUP_PREFIX + id, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 60,
    });
  } else {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(path.join(BACKUP_DIR, id), body, "utf-8");
  }
  lastBackupAt = now.getTime();
}

// Saves `data` (the content as it is before a change) as a restore point.
// "auto" backups are throttled to one per BACKUP_INTERVAL_MS; "restore" and
// "migration" backups are always taken so those changes can be undone.
async function backupBeforeChange(data: SiteContentItem[], reason: BackupReason): Promise<void> {
  const snapshot = JSON.parse(JSON.stringify(data)) as SiteContentItem[];
  try {
    if (reason === "auto" && Date.now() - lastBackupAt < BACKUP_INTERVAL_MS) return;
    const existing = await listBackupFiles();
    const newest = existing[0] ? Date.parse(existing[0].createdAt) : 0;
    if (reason === "auto" && Date.now() - newest < BACKUP_INTERVAL_MS) {
      lastBackupAt = newest;
      return;
    }
    await writeBackup(snapshot, reason);
    await pruneBackups(existing, MAX_BACKUPS - 1);
  } catch (err) {
    // A failed backup must not block the admin from saving content.
    console.error("[storage] Backup failed:", err);
    if (reason !== "auto") throw err;
  }
}

async function readBackup(id: string): Promise<SiteContentItem[] | null> {
  if (!parseBackupId(id)) return null;
  if (useBlob) {
    const { head, BlobNotFoundError } = await import("@vercel/blob");
    try {
      const meta = await head(BACKUP_PREFIX + id);
      const res = await fetch(meta.url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Blob fetch ${res.status}`);
      return (await res.json()) as SiteContentItem[];
    } catch (err: any) {
      if (err instanceof BlobNotFoundError || err?.name === "BlobNotFoundError") return null;
      throw err;
    }
  }
  const file = path.join(BACKUP_DIR, id);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as SiteContentItem[];
}

function getNextId(data: SiteContentItem[]): number {
  if (data.length === 0) return 1;
  return Math.max(...data.map((d) => d.id)) + 1;
}

export class JsonStorage {
  async getContentByPage(page: string): Promise<SiteContentItem[]> {
    const data = await readData();
    return data.filter((item) => item.page === page);
  }

  async getAllContent(): Promise<SiteContentItem[]> {
    return readData();
  }

  async upsertContent(
    page: string,
    section: string,
    contentKey: string,
    value: any,
  ): Promise<SiteContentItem> {
    const data = await readData();
    await backupBeforeChange(data, "auto");
    const idx = data.findIndex(
      (item) =>
        item.page === page &&
        item.section === section &&
        item.contentKey === contentKey,
    );

    if (idx >= 0) {
      data[idx].value = value;
      await writeData(data);
      return data[idx];
    }

    const newItem: SiteContentItem = {
      id: getNextId(data),
      page,
      section,
      contentKey,
      value,
    };
    data.push(newItem);
    await writeData(data);
    return newItem;
  }

  async deleteContent(id: number): Promise<void> {
    const data = await readData();
    await backupBeforeChange(data, "auto");
    const filtered = data.filter((item) => item.id !== id);
    await writeData(filtered);
  }

  async listBackups(): Promise<BackupInfo[]> {
    const files = await listBackupFiles();
    return files.map(({ url: _url, ...info }) => info);
  }

  async getBackup(id: string): Promise<SiteContentItem[] | null> {
    return readBackup(id);
  }

  async restoreContent(items: SiteContentItem[]): Promise<void> {
    await backupBeforeChange(await readData(), "restore");
    await writeData(items);
  }
}
