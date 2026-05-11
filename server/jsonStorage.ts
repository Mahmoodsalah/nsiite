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
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

let cache: SiteContentItem[] | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 5_000;

function ensureLocalDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function mergeSeedKeys(existing: SiteContentItem[]): {
  merged: SiteContentItem[];
  changed: boolean;
} {
  const seed = seedData as SiteContentItem[];
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
  return additions.length
    ? { merged: [...existing, ...additions], changed: true }
    : { merged: existing, changed: false };
}

async function readFromBlob(): Promise<SiteContentItem[]> {
  const { head, BlobNotFoundError } = await import("@vercel/blob");
  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Blob fetch ${res.status}`);
    const data = (await res.json()) as SiteContentItem[];
    const { merged, changed } = mergeSeedKeys(data);
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
    const filtered = data.filter((item) => item.id !== id);
    await writeData(filtered);
  }
}
