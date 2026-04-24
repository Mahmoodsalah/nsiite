import { pgTable, text, varchar, jsonb, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 50 }).notNull(),
  section: varchar("section", { length: 100 }).notNull(),
  contentKey: varchar("content_key", { length: 100 }).notNull(),
  value: jsonb("value").notNull(),
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
});

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
