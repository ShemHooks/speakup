"use client";

import { useState } from "react";
import { updateReport } from "@/server/actions/Reports/reports.action";
import { Eye } from "lucide-react";

export default function ReportsClient({ reports }: { reports: any[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  function openModal(report: any) {
    setActive(report);
    setStatus(report.status);
    setPriority(report.priority);
    setOpen(true);
  }

  async function onUpdate() {
    await updateReport(active.id, { status, priority });
    setOpen(false);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Desktop  */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr className="text-left text-zinc-600 dark:text-zinc-400">
              <th className="px-4 py-3">Report</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-zinc-800">
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="px-2 py-3">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-zinc-500">
                    By {r.is_anonymous ? "Anonymous" : r.writer}
                  </div>
                </td>
                <td className="">{r.type}</td>
                <td>{r.priority}</td>
                <td>{r.status}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openModal(r)}
                    className="text-blue-900 dark:text-blue-400 text-sm flex items-center gap-1 "
                  >
                    <Eye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile  */}
      <div className="md:hidden space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4 space-y-3"
          >
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-zinc-500">By {r.submittedBy}</p>
            </div>

            <div className="text-xs flex justify-between">
              <span>{r.priority}</span>
              <span>{r.status}</span>
            </div>

            <button
              onClick={() => openModal(r)}
              className="text-blue-900 dark:text-blue-400 text-sm flex items-center gap-1 "
            >
              <Eye /> View
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md p-5 space-y-4">
            <h2 className="font-semibold text-lg">Update Report</h2>

            <div className="space-y-2 text-sm">
              <p className="text-zinc-500">{active.title}</p>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border dark:border-zinc-700 bg-transparent px-3 py-2"
              >
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border dark:border-zinc-700 bg-transparent px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border dark:border-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={onUpdate}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
