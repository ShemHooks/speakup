import db from "@/server/db";
import { reports } from "@/server/db/schema/report";
import { eq, count as drizzleCount, gte } from "drizzle-orm";

export type AnalyticsData = {
  totalReports: number;
  weeklyReports: number;
  nonAnonymousReports: number;
  resolutionRate: number;
  statusDistribution: Record<string, number>;
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  reportsByCategory: {
    category: string;
    Suggestions: number;
    Complaints: number;
  }[];
  submissionsOverTime: { month: string; total: number }[];
};

export async function getAnalytics(): Promise<AnalyticsData> {
  /* TOTAL REPORTS */
  const [{ totalReports }] = await db
    .select({ totalReports: drizzleCount(reports.id) })
    .from(reports);

  /* RESOLVED REPORTS */
  const [{ resolvedReports }] = await db
    .select({ resolvedReports: drizzleCount(reports.id) })
    .from(reports)
    .where(eq(reports.status, "Resolved"));

  const resolutionRate = totalReports
    ? (resolvedReports / totalReports) * 100
    : 0;

  /* THIS WEEK REPORTS */
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [{ weeklyReports }] = await db
    .select({ weeklyReports: drizzleCount(reports.id) })
    .from(reports)
    .where(gte(reports.created_at, startOfWeek));

  /* NON-ANONYMOUS REPORTS */
  const [{ nonAnonymousReports }] = await db
    .select({ nonAnonymousReports: drizzleCount(reports.id) })
    .from(reports)
    .where(eq(reports.is_anonymous, false));

  /* PRIORITY DISTRIBUTION */
  const priorities = ["High", "Medium", "Low"] as const;
  const priorityCounts = { High: 0, Medium: 0, Low: 0 };

  for (const priority of priorities) {
    const [{ total }] = await db
      .select({ total: drizzleCount(reports.id) })
      .from(reports)
      .where(eq(reports.priority, priority));

    priorityCounts[priority] = total;
  }

  const categoryRows = await db
    .select({
      category: reports.category,
      type: reports.type,
    })
    .from(reports);

  console.log("Category Row", categoryRows);

  const reportsByCategory: Record<
    string,
    { Suggestions: number; Complaints: number }
  > = {};

  for (const row of categoryRows) {
    if (!reportsByCategory[row.category]) {
      reportsByCategory[row.category] = { Suggestions: 0, Complaints: 0 };
    }

    if (row.type === "suggestion") {
      reportsByCategory[row.category].Suggestions += 1;
    }

    if (row.type === "complaint") {
      reportsByCategory[row.category].Complaints += 1;
    }
  }

  const categoryData = Object.entries(reportsByCategory).map(
    ([category, stats]) => ({
      category,
      Suggestions: stats.Suggestions || 0,
      Complaints: stats.Complaints || 0,
    }),
  );

  console.log(categoryData);

  /* SUBMISSIONS OVER TIME */
  const submissionRows = await db
    .select({ createdAt: reports.created_at })
    .from(reports);

  const monthMap: Record<string, number> = {};

  for (const row of submissionRows) {
    const month = new Date(row.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthMap[month] = (monthMap[month] ?? 0) + 1;
  }

  const submissionsOverTime = Object.entries(monthMap).map(
    ([month, total]) => ({ month, total }),
  );

  const statusRows = await db
    .select({
      status: reports.status,
    })
    .from(reports);

  const statusDistribution: Record<string, number> = {};

  for (const row of statusRows) {
    statusDistribution[row.status] = (statusDistribution[row.status] ?? 0) + 1;
  }

  return {
    totalReports,
    weeklyReports,
    nonAnonymousReports,
    resolutionRate: Number(resolutionRate.toFixed(1)),
    priorityDistribution: {
      high: priorityCounts.High,
      medium: priorityCounts.Medium,
      low: priorityCounts.Low,
    },
    reportsByCategory: categoryData,
    submissionsOverTime,
    statusDistribution,
  };
}
