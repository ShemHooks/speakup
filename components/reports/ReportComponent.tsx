"use client";

import { useState } from "react";
import { updateReport } from "@/server/actions/Reports/reports.action";
import { Eye, X, CircleUser, Calendar, Loader2 } from "lucide-react";

const toSentenceCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const statusLabel: Record<string, string> = {
  in_review: "In Review",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export default function ReportsClient({ reports }: { reports: any[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [updating, setUpdating] = useState(false);

  function openModal(report: any) {
    setActive(report);
    setStatus(report.status);
    setPriority(report.priority);
    setOpen(true);
  }

  async function updateField(field: "status" | "priority", value: string) {
    if (!active || updating) return;

    setUpdating(true);

    if (field === "status") setStatus(value);
    if (field === "priority") setPriority(value);

    try {
      await updateReport(active.id, {
        status: field === "status" ? value : status,
        priority: field === "priority" ? value : priority,
      });
    } finally {
      setUpdating(false);
    }
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
                <td>{statusLabel[r.status] ?? r.status}</td>
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
              <p className="text-xs text-zinc-500">
                By {r.is_anonymous ? "Anonymous" : r.writer}
              </p>
            </div>

            <div className="text-xs flex justify-between">
              <span>{r.priority}</span>
              <span>{statusLabel[r.status] ?? r.status}</span>
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900/97 rounded-xl overflow-y-scroll h-120 w-200 pb-4">
            <div className="flex justify-between boder border-b p-4 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="bg-red-800/40 p-1 pr-1.5 pl-1.5 rounded-full">
                    <h6 className="text-xs font-semibold">{active.type}</h6>
                  </div>
                  <div className="bg-yellow-800/40 p-1 pr-1.5 pl-1.5 rounded-full">
                    <h6 className="text-xs font-semibold">{active.priority}</h6>
                  </div>
                  <div className="bg-orange-800/40 p-1 pr-1.5 pl-1.5 rounded-full">
                    <h6 className="text-xs font-semibold">
                      {active.is_anonymous ? "Anonymous" : "User"}
                    </h6>
                  </div>
                </div>
                <div>
                  <h1 className="font-bold">{active.title}</h1>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                >
                  <X />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 pl-4 mt-6 pr-4">
              <div className="flex gap-10">
                <div>
                  <h6 className="text-sm text-gray-600">Category</h6>
                  <h4 className="capitalize font-semibold">
                    {active.category}
                  </h4>
                </div>
                <div>
                  <h6 className="text-sm text-gray-600">Status</h6>
                  <h4 className="capitalize font-semibold">{active.status}</h4>
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <h6 className="text-sm text-gray-600">Submitted By</h6>
                  <div className="flex gap-1 items-center">
                    <CircleUser color="blue" size={18} />
                    <h4 className="capitalize font-semibold">
                      {active.is_anonymous ? "Anonymous" : active.writer}
                    </h4>
                  </div>
                </div>
                <div>
                  <h6 className="text-sm text-gray-600">Date Submitted</h6>
                  <div className="flex gap-1 items-center">
                    <Calendar color="gray" size={18} />
                    <h4 className="font-semibold">
                      {new Date(active.created_at).toLocaleDateString()}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <h5 className="text-sm text-gray-600">Description</h5>
              <div className="bg-gray-50 dark:bg-slate-800/80 rounded-lg p-4">
                <p>{toSentenceCase(active.description)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-4 flex flex-col gap-2">
                <h6 className="text-gray-600 text-sm">Update Status</h6>
                <div className="flex gap-6">
                  <button
                    disabled={updating}
                    onClick={() => updateField("status", "in_review")}
                    className="rounded-lg p-2.5 bg-blue-700 text-white font-semibold"
                  >
                    Mark as In Review
                  </button>
                  <button
                    onClick={() => updateField("status", "in_progress")}
                    className="rounded-lg p-2.5 bg-yellow-600 text-white font-semibold"
                  >
                    Mark as In Progress
                  </button>
                  <button
                    onClick={() => updateField("status", "resolved")}
                    className="rounded-lg p-2.5 bg-green-700 text-white font-semibold"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h6 className="text-gray-600 text-sm">Update Priority Level</h6>
                <div className="flex gap-6">
                  <button
                    onClick={() => updateField("priority", "High")}
                    className="rounded-lg p-2.5 bg-red-500/10 border border-red-500 text-red-800 font-semibold"
                  >
                    Set High Priority
                  </button>
                  <button
                    onClick={() => updateField("priority", "Medium")}
                    className="rounded-lg p-2.5 bg-yellow-500/10 border border-yellow-500 text-yellow-700 font-semibold"
                  >
                    Set Meduim Priority
                  </button>
                  <button
                    onClick={() => updateField("priority", "Low")}
                    className="rounded-lg p-2.5 bg-blue-700/10 border border-blue-500 text-blue-700 font-semibold"
                  >
                    Set Low Priority
                  </button>
                </div>
              </div>
            </div>
          </div>
          {updating && (
            <div
              className="absolute inset-0 z-50 bg-white/70 dark:bg-slate-900/80
                  flex items-center justify-center backdrop-blur-sm"
            >
              <Loader2 className="animate-spin text-blue-700" size={32} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
