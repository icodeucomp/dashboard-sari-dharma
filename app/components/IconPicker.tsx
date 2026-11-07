"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Icon from "@mdi/react";
import * as MDIIcons from "@mdi/js";

interface IconItem {
  name: string;
  path: string;
}

const LIMIT = 50;

const getIconPath = (iconName: string) => {
  return (MDIIcons as { [key: string]: string })[iconName];
};

export default function IconPicker({
  selectedIcon,
  onSelect,
}: {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["icons", searchTerm],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get<IconItem[]>("/api/icons", {
        params: { query: searchTerm, limit: LIMIT, offset: pageParam },
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === LIMIT ? pages.length * LIMIT : undefined),
    enabled: isOpen,
    staleTime: Infinity,
  });

  const icons = data?.pages.flat() ?? [];

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => setSearchTerm(e.target.value.trim()), 500);
  };

  const handleScroll = () => {
    if (!dropdownRef.current || !hasNextPage || isFetching) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchNextPage();
    }
  };

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md"
      >
        {selectedIcon && (
          <Icon path={getIconPath(selectedIcon) || ""} size={1} className="mr-2" />
        )}
        Pilih Ikon
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg px-4 pt-4 pb-[200px] max-h-64 overflow-y-auto w-64"
          onScroll={handleScroll}
        >
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={(e) => e.key === "Enter" && setSearchTerm(query.trim())}
            placeholder="Cari ikon..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
          />

          <div className="grid grid-cols-4 gap-4">
            {icons.map((icon) => (
              <button
                key={icon.name}
                type="button"
                onClick={() => handleSelect(icon.name)}
                className="flex cursor-pointer items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={icon.name}
              >
                <Icon path={icon.path} size={1} className="text-gray-600 dark:text-gray-400" />
              </button>
            ))}
          </div>

          {isFetching && <p className="text-center text-sm text-gray-500 mt-4">Memuat...</p>}
        </div>
      )}
    </div>
  );
}
