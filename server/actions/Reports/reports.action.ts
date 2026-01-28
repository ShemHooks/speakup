"use server";

import db from "@/server/db";
import { reports } from "@/server/db/schema/report";
import { and, eq, ilike, or, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { report } from "process";
import { writer } from "repl";

export async function submitReport(formData: FormData) {
  const isAnonymous = formData.get("anonymous") === "true";

  const data = {
    type: formData.get("type") as string,
    category: formData.get("category") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,

    is_anonymous: isAnonymous,
    status: "Pending",
    priority: "Medium",

    writer: isAnonymous ? null : (formData.get("name") as string),
    email: isAnonymous ? null : (formData.get("email") as string),
    contact_info: isAnonymous ? null : (formData.get("phone") as string),
  };

  if (!data.type || !data.category || !data.title || !data.description) {
    throw new Error("Missing required fields");
  }

  await db.insert(reports).values(data);

  return { success: true };
}

export async function getReports(filters: {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  category?: string;
  sort?: "newest" | "oldest";
}) {
  const conditions = [];

  if (filters.search) {
    console.log("Search input test", filters.search);
    conditions.push(
      or(
        ilike(reports.title, `%${filters.search}%`),
        ilike(reports.description, `%${filters.search}%`),
        ilike(reports.writer, `%${filters.search}%`),
      ),
    );
  }

  if (filters.type && filters.type !== "all") {
    conditions.push(eq(reports.type, filters.type));
  }

  if (filters.status && filters.status !== "all") {
    conditions.push(eq(reports.status, filters.status));
  }

  if (filters.priority && filters.priority !== "all") {
    conditions.push(eq(reports.priority, filters.priority));
  }

  if (filters.category && filters.category !== "all") {
    conditions.push(eq(reports.category, filters.category));
  }

  return db
    .select()
    .from(reports)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(
      filters.sort === "oldest"
        ? asc(reports.created_at)
        : desc(reports.created_at),
    );
}

export async function updateReport(
  id: string,
  data: { status: string; priority: string },
) {
  await db
    .update(reports)
    .set({
      status: data.status as any,
      priority: data.priority as any,
    })
    .where(eq(reports.id, id));

  revalidatePath("/admin/reports");
}
