import { formatDistanceToNow } from "date-fns";

export default function RecentActivity({ reports }: any) {
  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Recent Activity</h3>
        <p className="text-sm text-gray-600 text-muted-foreground">
          Latest submissions and updates
        </p>
      </div>

      <ul className="divide-y">
        {reports.map((r: any) => (
          <li key={r.id} className="p-4 space-y-1">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs rounded px-2 py-0.5 bg-orange-100 dark:bg-orange-900">
                {r.type}
              </span>
              <span className="text-xs rounded px-2 py-0.5 bg-red-100 dark:bg-red-900">
                {r.priority}
              </span>
              <span className="text-xs rounded px-2 py-0.5 bg-blue-100 dark:bg-blue-900">
                {r.status}
              </span>
            </div>

            <p className="font-medium">{r.title}</p>

            <p className="text-xs text-muted-foreground text-gray-500">
              {r.is_anonymous ? "Anonymous" : r.writer} •{" "}
              {formatDistanceToNow(new Date(r.created_at))} ago
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
