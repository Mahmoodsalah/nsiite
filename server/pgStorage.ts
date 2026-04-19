import { db } from "./db";
import { siteContent } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { SiteContentItem } from "./jsonStorage";

export class PgStorage {
  async getContentByPage(page: string): Promise<SiteContentItem[]> {
    const rows = await db.select().from(siteContent).where(eq(siteContent.page, page));
    return rows as SiteContentItem[];
  }

  async getAllContent(): Promise<SiteContentItem[]> {
    const rows = await db.select().from(siteContent);
    return rows as SiteContentItem[];
  }

  async upsertContent(page: string, section: string, contentKey: string, value: any): Promise<SiteContentItem> {
    const existing = await db
      .select()
      .from(siteContent)
      .where(
        and(
          eq(siteContent.page, page),
          eq(siteContent.section, section),
          eq(siteContent.contentKey, contentKey),
        ),
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(siteContent)
        .set({ value })
        .where(eq(siteContent.id, existing[0].id))
        .returning();
      return updated as SiteContentItem;
    }

    const [inserted] = await db
      .insert(siteContent)
      .values({ page, section, contentKey, value })
      .returning();
    return inserted as SiteContentItem;
  }

  async deleteContent(id: number): Promise<void> {
    await db.delete(siteContent).where(eq(siteContent.id, id));
  }
}
