"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { usePathname } from "next/navigation";

export default function ReportFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg dark:border-blue-900/30 p-6 mt-4 ">
      <div className="border rounded-lg flex p-2 gap-1 focus-within:border-blue-400">
        <Search className="text-gray-600" />
        <input
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Search reports..."
          className="w-full outline-none"
          onChange={(e) => updateParam("q", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap mt-4">
        <select
          defaultValue={searchParams.get("type") ?? "all"}
          onChange={(e) => updateParam("type", e.target.value)}
          className="w-full sm:w-auto min-w-37.5 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="suggestion">Suggestion</option>
          <option value="complaint">Complaint</option>
        </select>

        <select
          defaultValue={searchParams.get("status") ?? "all"}
          onChange={(e) => updateParam("status", e.target.value)}
          className="w-full sm:w-auto min-w-37.5 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          defaultValue={searchParams.get("priority") ?? "all"}
          onChange={(e) => updateParam("priority", e.target.value)}
          className="w-full sm:w-auto min-w-37.5 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          defaultValue={searchParams.get("category") ?? "all"}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full sm:w-auto min-w-37.5 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="public-services">Public Services</option>
          <option value="permits">Permits & Licenses</option>
          <option value="billing">Fees & Payments</option>
          <option value="staff">Personnel Conduct</option>
          <option value="infrastructure">Infrastructure</option>
        </select>
      </div>
    </div>
  );
}
