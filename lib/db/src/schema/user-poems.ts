import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userPoemsTable = pgTable("user_poems", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  bnTitle: text("bn_title"),
  lines: text("lines").notNull(),
  bnLines: text("bn_lines"),
  mood: text("mood").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserPoemSchema = createInsertSchema(userPoemsTable).omit({ createdAt: true });
export type InsertUserPoem = z.infer<typeof insertUserPoemSchema>;
export type UserPoem = typeof userPoemsTable.$inferSelect;
