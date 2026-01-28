"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Poppins } from "next/font/google";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/analytics": "Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = titleMap[pathname] ?? "Page";
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    router.push("/");
  };

  const dateNow = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
    { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed z-40 h-full w-64 backdrop-blur-md shadow-md flex flex-col
          border-r border-gray-900/30 dark:border-blue-900/30
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 flex flex-col justify-center items-center border-b border-gray-900/30 dark:border-blue-900/30">
          <img src="/photos/speakup.png" alt="" className="w-20 h-20" />
          <h3 className="text-center text-gray-600">Admin Portal</h3>
        </div>

        <nav className="flex-1 space-y-2 ">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`${poppins.className} flex items-center gap-3 px-4 py-2 rounded-lg font-black transition
                  ${
                    pathname === item.path
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className="w-full flex items-center justify-center gap-2 h-17 text-red-600 px-4 py-2
          border-t border-gray-900/30 dark:border-blue-900/30 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 min-h-screen md:ml-64">
        <nav
          className="p-5 border-b border-gray-900/30 dark:border-blue-900/30
          font-bold fixed w-full z-20  flex items-center gap-3 bg-white dark:bg-[#0a0a0a]"
        >
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-xl">{pageTitle}</h1>
            <p className="text-gray-400 font-light text-sm">{dateNow}</p>
          </div>
        </nav>

        <div className="mt-20 p-6 ">{children}</div>
      </main>
    </div>
  );
}
