import { JsonStorage, type SiteContentItem } from "./jsonStorage";
import { PgStorage } from "./pgStorage";

export interface IStorage {
  getContentByPage(page: string): Promise<SiteContentItem[]>;
  getAllContent(): Promise<SiteContentItem[]>;
  upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContentItem>;
  deleteContent(id: number): Promise<void>;
}

const useDatabase = !!process.env.DATABASE_URL;

export const storage: IStorage = useDatabase ? new PgStorage() : new JsonStorage();

if (useDatabase) {
  console.log("[storage] Using Postgres (DATABASE_URL is set)");
} else {
  console.log("[storage] Using JSON file (data/content.json)");
}
