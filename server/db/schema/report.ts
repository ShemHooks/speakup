import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 20 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  is_anonymous: boolean("is_anonymous").notNull().default(true),
  status: varchar("status", { length: 20 }).notNull().default("Pending"),
  priority: varchar("priority", { length: 10 }).default("Medium"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  contact_info: text("contact_info"),
  writer: text("writer"),
  email: text("email"),
});
