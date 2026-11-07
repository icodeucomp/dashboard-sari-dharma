"use client";
import { useState, useRef, useEffect } from "react";
import Icon from "@mdi/react";
import {
  mdiMenu,
  mdiChevronDown,
  mdiLogout,
} from "@mdi/js";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function Header({ toggleSidebar, isSidebarOpen }: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData] = useState<UserData | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Icon path={mdiMenu} size={1} />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userData?.email || "user@example.com"}
              </p>
            </div>
            <Icon path={mdiChevronDown} size={0.7} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; samesite=lax;';
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('user');
                  router.push('/login');
                }}
                className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700 flex items-center"
              >
                <Icon path={mdiLogout} size={0.8} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
