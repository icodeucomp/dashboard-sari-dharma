"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";
import { useIsClient, useMediaQuery } from "../hooks/useMediaQuery";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isClient = useIsClient();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();

  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (!isDesktop) {
      setManualOpen(false);
    }
  }

  const sidebarOpen = manualOpen ?? isDesktop;

  const toggleSidebar = () => {
    setManualOpen(!sidebarOpen);
  };

  if (!isClient) {
    return <div className="h-screen bg-gray-100 dark:bg-gray-900"></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      <div className={`flex-1 min-w-0 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 65px)' }}>
          <Breadcrumbs />

          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
