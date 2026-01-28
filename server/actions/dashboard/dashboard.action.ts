// app/actions/dashboard.action.ts
"use server";

import db from "@/server/db";
import { reports } from "@/server/db/schema/report";
import { eq, ne, desc } from "drizzle-orm";

export async function getDashboardData() {
  const totalSubmissions = await db.select({ count: reports.id }).from(reports);

  const pendingComplaints = await db
    .select({ count: reports.id })
    .from(reports)
    .where(eq(reports.status, "Pending"));

  const resolvedReports = await db
    .select({ count: reports.id })
    .from(reports)
    .where(eq(reports.status, "Resolved"));

  const highPriorityCases = await db
    .select({ count: reports.id })
    .from(reports)
    .where(eq(reports.priority, "High"));

  const recentReports = await db
    .select()
    .from(reports)
    .orderBy(desc(reports.created_at))
    .limit(5);

  return {
    stats: {
      totalSubmissions: totalSubmissions.length,
      pendingComplaints: pendingComplaints.length,
      resolvedReports: resolvedReports.length,
      highPriorityCases: highPriorityCases.length,
    },
    recentReports,
  };
}
