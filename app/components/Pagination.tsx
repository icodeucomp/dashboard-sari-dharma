"use client";

import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from "@mdi/js";

// Literal class names on purpose: Tailwind cannot see names built from a variable.
const ACTIVE_PAGE = {
  orange: "bg-orange-600 text-white border-orange-600",
  blue: "bg-blue-600 text-white border-blue-600",
  green: "bg-green-600 text-white border-green-600",
} as const;

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
  activeColor?: "orange" | "blue" | "green";
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className = "",
  activeColor = "orange"
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const displayInfo = `Menampilkan ${indexOfFirstItem + 1} - ${
    indexOfLastItem > totalItems ? totalItems : indexOfLastItem
  } dari ${totalItems} item`;

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const PageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
    <button
      onClick={() => paginate(number)}
      className={`h-8 w-8 flex items-center justify-center mx-1 rounded-md border ${
        isActive
          ? ACTIVE_PAGE[activeColor]
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {number}
    </button>
  );

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col items-center justify-between gap-3 md:flex-row ${className || "mt-6"}`}>
      {showInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {displayInfo}
        </div>
      )}

      <div className="flex items-center">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`h-8 w-8 flex items-center justify-center rounded-md mr-1 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed bg-white border border-gray-200"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        >
          <Icon path={mdiPageFirst} size={1} />
        </button>

        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`h-8 w-8 flex items-center justify-center rounded-md mr-1 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed bg-white border border-gray-200"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        >
          <Icon path={mdiChevronLeft} size={1} />
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          return (
            <PageNumber
              key={pageNum}
              number={pageNum}
              isActive={currentPage === pageNum}
            />
          );
        })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`h-8 w-8 flex items-center justify-center rounded-md ml-1 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed bg-white border border-gray-200"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        >
          <Icon path={mdiChevronRight} size={1} />
        </button>

        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={`h-8 w-8 flex items-center justify-center rounded-md ml-1 ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed bg-white border border-gray-200"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        >
          <Icon path={mdiPageLast} size={1} />
        </button>
      </div>
    </div>
  );
}
