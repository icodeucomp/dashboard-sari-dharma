"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Icon from "@mdi/react";

/**
 * Komponen untuk memilih ikon dari daftar yang tersedia
 * @param {Object} props - Properti komponen
 * @param {string} props.selectedIcon - Ikon yang dipilih
 * @param {Function} props.onSelect - Fungsi untuk menangani pemilihan ikon
 * @returns {JSX.Element}
 */
export default function IconPicker({
  selectedIcon,
  onSelect,
}: {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [icons, setIcons] = useState<{ name: string; path: string }[]>([]);
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const LIMIT = 50;

  /**
   * Fungsi untuk memuat ikon dari API
   * @param {boolean} reset - Apakah data harus di-reset
   */
  const loadIcons = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get("/api/icons", {
        params: { query, limit: LIMIT, offset: reset ? 0 : offset },
      });
      setIcons(reset ? response.data : [...icons, ...response.data]);
      setOffset(reset ? LIMIT : offset + LIMIT);
    } catch (error) {
      console.error("Gagal memuat ikon:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk menangani pencarian ikon
   */
  const handleSearch = () => {
    if (query.trim() !== "") {
      setOffset(0);
      loadIcons(true);
    }
  };

  /**
   * Fungsi untuk menangani perubahan input pencarian
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input
   */
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    // Reset timeout jika masih mengetik
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Lakukan pencarian setelah 3 detik tidak ada aktivitas mengetik
    typingTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 2000);
  };

  /**
   * Fungsi untuk menangani infinite scroll
   */
  const handleScroll = () => {
    if (!dropdownRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadIcons();
    }
  };

  /**
   * Fungsi untuk menangani pemilihan ikon
   * @param {string} icon - Ikon yang dipilih
   */
  const handleSelect = (icon: string) => {
    onSelect(icon);
    setIsOpen(false);
  };

  /**
   * Fungsi untuk menangani klik di luar dropdown
   * @param {MouseEvent} event - Event klik
   */
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Menambahkan event listener untuk klik di luar dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memuat ikon saat dropdown dibuka
  useEffect(() => {
    if (isOpen) {
      loadIcons(true);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Tombol untuk membuka dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md"
      >
        {selectedIcon && (
          <Icon path={selectedIcon || ""} size={1} className="mr-2" />
        )}
        Pilih Ikon
      </button>

      {/* Dropdown untuk memilih ikon */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg px-4 pt-4 pb-[200px] max-h-64 overflow-y-auto w-64"
          onScroll={handleScroll}
        >
          {/* Kotak pencarian */}
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Cari ikon..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
          />

          {/* Daftar ikon */}
          <div className="grid grid-cols-4 gap-4">
            {icons.map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => handleSelect(icon.path)}
                className="flex cursor-pointer items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon
                  path={icon.path}
                  size={1}
                  className="text-gray-600 dark:text-gray-400"
                />
              </button>
            ))}
          </div>

          {/* Indikator loading */}
          {loading && (
            <p className="text-center text-sm text-gray-500 mt-4">Memuat...</p>
          )}
        </div>
      )}
    </div>
  );
}
