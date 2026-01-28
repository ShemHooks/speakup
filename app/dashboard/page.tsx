import { getDashboardData } from "@/server/actions/dashboard/dashboard.action";
import DashboardStats from "@/components/DashboardComponents/DashboardStats";
import RecentActivity from "@/components/DashboardComponents/RecentActivity";

export default async function page() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <DashboardStats stats={data.stats} />
      <RecentActivity reports={data.recentReports} />
    </div>
  );
}
