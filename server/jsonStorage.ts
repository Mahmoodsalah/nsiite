import fs from "fs";
import path from "path";

export interface SiteContentItem {
  id: number;
  page: string;
  section: string;
  contentKey: string;
  value: any;
}

const DATA_FILE = path.join(process.cwd(), "data", "content.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readData(): SiteContentItem[] {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: SiteContentItem[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getNextId(data: SiteContentItem[]): number {
  if (data.length === 0) return 1;
  return Math.max(...data.map((d) => d.id)) + 1;
}

export class JsonStorage {
  async getContentByPage(page: string): Promise<SiteContentItem[]> {
    return readData().filter((item) => item.page === page);
  }

  async getAllContent(): Promise<SiteContentItem[]> {
    return readData();
  }

  async upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContentItem> {
    const data = readData();
    const idx = data.findIndex(
      (item) => item.page === page && item.section === section && item.contentKey === contentKey
    );

    if (idx >= 0) {
      data[idx].value = value;
      writeData(data);
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
    writeData(data);
    return newItem;
  }

  async deleteContent(id: number): Promise<void> {
    const data = readData();
    const filtered = data.filter((item) => item.id !== id);
    writeData(filtered);
  }
}
