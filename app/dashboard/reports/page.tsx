import { getReports } from "@/server/actions/Reports/reports.action";
import ReportsClient from "@/components/reports/ReportComponent";
import ReportFilters from "@/components/reports/ReportFilter";

export const dynamic = "force-dynamic";

type ReportsPageProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = (await searchParams) ?? {};

  const reports = await getReports({
    search: params.q,
    type: params.type,
    status: params.status,
    priority: params.priority,
    category: params.category,
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">Reports</h1>
      <p className="text-sm text-zinc-500">View and manage all submissions</p>

      <ReportFilters />
      <ReportsClient reports={reports} />
    </div>
  );
}
