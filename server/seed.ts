import fs from "fs";
import path from "path";
import { db, pool } from "./db";
import { siteContent } from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface ContentItem {
  id?: number;
  page: string;
  section: string;
  contentKey: string;
  value: any;
}

async function seed() {
  const dataFile = path.join(process.cwd(), "data", "content.json");
  if (!fs.existsSync(dataFile)) {
    console.error(`Source file not found: ${dataFile}`);
    process.exit(1);
  }

  const items: ContentItem[] = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  console.log(`Seeding ${items.length} content items from data/content.json...`);

  let inserted = 0;
  let updated = 0;

  for (const item of items) {
    const existing = await db
      .select()
      .from(siteContent)
      .where(
        and(
          eq(siteContent.page, item.page),
          eq(siteContent.section, item.section),
          eq(siteContent.contentKey, item.contentKey),
        ),
      );

    if (existing.length > 0) {
      await db
        .update(siteContent)
        .set({ value: item.value })
        .where(eq(siteContent.id, existing[0].id));
      updated++;
    } else {
      await db.insert(siteContent).values({
        page: item.page,
        section: item.section,
        contentKey: item.contentKey,
        value: item.value,
      });
      inserted++;
    }
  }

  console.log(`Seeding complete. Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("Seeding failed:", err);
  await pool.end().catch(() => {});
  process.exit(1);
});
