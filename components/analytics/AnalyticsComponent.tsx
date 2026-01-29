"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type PriorityLabel = "High Priority" | "Medium Priority" | "Low Priority";

const priorityColors: Record<PriorityLabel, string> = {
  "High Priority": "bg-red-500",
  "Medium Priority": "bg-yellow-500",
  "Low Priority": "bg-blue-500",
};

export default function AnalyticsComponent({ analytics }: { analytics: any }) {
  const categoryData = analytics.reportsByCategory;

  return (
    <main className="flex-1 min-h-screen  bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl md:text-2xl font-semibold">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Insights and trends across all submissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <p className="text-sm text-zinc-500">Total Reports</p>
          <p className="text-2xl font-bold">{analytics.totalReports}</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <p className="text-sm text-zinc-500">This Week Inputs</p>
          <p className="text-2xl font-bold">{analytics.weeklyReports}</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <p className="text-sm text-zinc-500">Non-Anonymous Inputs</p>
          <p className="text-2xl font-bold">{analytics.nonAnonymousReports}</p>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <p className="text-sm text-zinc-500">Resolution Rate</p>
          <p className="text-2xl font-bold">{analytics.resolutionRate}%</p>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow space-y-3">
        <h2 className="font-semibold text-lg">Current Priority Distribution</h2>
        <div className="space-y-2">
          {[
            {
              label: "High Priority",
              value: analytics.priorityDistribution.high,
              color: "red-500",
              total:
                analytics.priorityDistribution.high +
                analytics.priorityDistribution.medium +
                analytics.priorityDistribution.low,
            },
            {
              label: "Medium Priority",
              value: analytics.priorityDistribution.medium,
              color: "yellow-500",
              total:
                analytics.priorityDistribution.high +
                analytics.priorityDistribution.medium +
                analytics.priorityDistribution.low,
            },
            {
              label: "Low Priority",
              value: analytics.priorityDistribution.low,
              color: "blue-500",
              total:
                analytics.priorityDistribution.high +
                analytics.priorityDistribution.medium +
                analytics.priorityDistribution.low,
            },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <p className="text-sm">{item.label}</p>
              <p className="text-sm">
                {item.value} cases (
                {((item.value / item.total) * 100).toFixed(0)}%)
              </p>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full ml-4 relative">
                <div
                  className={`h-2 rounded-full ${priorityColors[item.label as PriorityLabel]}`}
                  style={{ width: `${(item.value / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Reports by Category</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Suggestions" fill="#7c3aed" />
              <Bar dataKey="Complaints" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Submissions Over Time */}
        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Submissions Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={analytics.submissionsOverTime}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#4338ca"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-2">Reports by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.entries(analytics.statusDistribution).map(
                ([status, count]) => ({ status, count }),
              )}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
