import { pgTable, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const admin_users = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).default("Admin"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
