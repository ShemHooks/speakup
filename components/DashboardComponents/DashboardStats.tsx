type Props = {
  stats: {
    totalSubmissions: number;
    pendingComplaints: number;
    resolvedReports: number;
    highPriorityCases: number;
  };
};

export default function DashboardStats({ stats }: Props) {
  const cards = [
    { label: "Total Submissions", value: stats.totalSubmissions },
    { label: "Pending Complaints", value: stats.pendingComplaints },
    { label: "Resolved Reports", value: stats.resolvedReports },
    { label: "High Priority Cases", value: stats.highPriorityCases },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-sm"
        >
          <p className="text-2xl font-semibold">{c.value}</p>
          <p className="text-sm text-muted-foreground">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
