"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Breadcrumbs from "./components/Breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle client-side only code
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Avoid hydration mismatch by rendering only after component has mounted
  if (!mounted) {
    return <div className="h-screen bg-gray-100 dark:bg-gray-900"></div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {/* Breadcrumbs */}
          <Breadcrumbs />
          
          {/* Page Content */}
          <div className="mt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
