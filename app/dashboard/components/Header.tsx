"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiMenu, 
  mdiAccountCircleOutline, 
  mdiChevronDown, 
  mdiLogout, 
  mdiCogOutline,
  mdiMagnify
} from "@mdi/js";
import { useRouter } from "next/navigation";

/**
 * Komponen Header untuk dashboard
 * @param {Function} toggleSidebar - Fungsi untuk toggle sidebar
 * @param {boolean} isSidebarOpen - Status sidebar terbuka/tertutup
 * @returns {JSX.Element}
 */
export default function Header({ toggleSidebar, isSidebarOpen }: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fungsi untuk menangani klik di luar dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    router.push("/login");
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
    // Implementasi pencarian di sini
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
      {/* Bagian kiri - Toggle menu dan kotak pencarian */}
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Icon path={mdiMenu} size={1} />
        </button>
        <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-r-md"
          >
            <Icon path={mdiMagnify} size={1} />
          </button>
        </form>
      </div>

      {/* Bagian kanan - Pemilih bahasa dan profil pengguna */}
      <div className="flex items-center space-x-3">
        {/* Pemilih bahasa */}
        <div className="relative" ref={languageDropdownRef}>
          <button
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <span>ID</span>
            <Icon path={mdiChevronDown} size={0.7} />
          </button>

          {languageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => console.log("Language switched to ID")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                ID
              </button>
              <button
                onClick={() => console.log("Language switched to EN")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                EN
              </button>
            </div>
          )}
        </div>

        {/* Dropdown profil */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Asya</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
            <Icon path={mdiChevronDown} size={0.7} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              <Link href="/dashboard/profile" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center">
                <Icon path={mdiAccountCircleOutline} size={0.8} className="mr-2" />
                Profil Saya
              </Link>
              <Link href="/dashboard/pengaturan" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 flex items-center">
                <Icon path={mdiCogOutline} size={0.8} className="mr-2" />
                Pengaturan
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700 flex items-center"
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
