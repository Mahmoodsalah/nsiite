import { JsonStorage, type SiteContentItem } from "./jsonStorage";

export interface IStorage {
  getContentByPage(page: string): Promise<SiteContentItem[]>;
  getAllContent(): Promise<SiteContentItem[]>;
  upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContentItem>;
  deleteContent(id: number): Promise<void>;
}

export const storage: IStorage = new JsonStorage();

console.log("[storage] Using JSON file (data/content.json)");
