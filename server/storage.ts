import { siteContent, type SiteContent, type InsertSiteContent } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getContentByPage(page: string): Promise<SiteContent[]>;
  getAllContent(): Promise<SiteContent[]>;
  upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContent>;
  deleteContent(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getContentByPage(page: string): Promise<SiteContent[]> {
    return db.select().from(siteContent).where(eq(siteContent.page, page));
  }

  async getAllContent(): Promise<SiteContent[]> {
    return db.select().from(siteContent);
  }

  async upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContent> {
    const existing = await db
      .select()
      .from(siteContent)
      .where(
        and(
          eq(siteContent.page, page),
          eq(siteContent.section, section),
          eq(siteContent.contentKey, contentKey)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(siteContent)
        .set({ value })
        .where(eq(siteContent.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(siteContent)
      .values({ page, section, contentKey, value })
      .returning();
    return created;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(siteContent).where(eq(siteContent.id, id));
  }
}

export const storage = new DatabaseStorage();
