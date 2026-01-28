import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { reports } from "./report";

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  report_id: uuid("report_id")
    .references(() => reports.id)
    .notNull(),
  file_url: text("file_url").notNull(),
  file_type: varchar("file_type", { length: 50 }),
  uploaded_at: timestamp("uploaded_at").defaultNow().notNull(),
});
