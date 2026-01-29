// app/dashboard/analytics/page.tsx
import { getAnalytics } from "@/server/actions/analytics/analytics.action";
import AnalyticsComponent from "@/components/analytics/AnalyticsComponent";

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();
  return <AnalyticsComponent analytics={analytics} />;
}
