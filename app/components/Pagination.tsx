"use client";

import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight, mdiPageFirst, mdiPageLast } from "@mdi/js";

/**
 * Props untuk komponen Pagination
 * @interface PaginationProps
 * @property {number} currentPage - Halaman yang sedang aktif
 * @property {number} totalItems - Total jumlah item dalam data
 * @property {number} itemsPerPage - Jumlah item per halaman
 * @property {function} onPageChange - Fungsi callback ketika halaman berubah
 * @property {boolean} showInfo - Menampilkan info pagination "Menampilkan x-y dari z"
 * @property {string} className - Class tambahan untuk container
 * @property {string} activeColor - Warna untuk halaman aktif (bg-{color}-600)
 */
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
  activeColor?: string;
}

/**
 * Komponen Pagination yang dapat digunakan kembali
 * @param {PaginationProps} props - Props untuk komponen
 * @returns {JSX.Element}
 */
export default function Pagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  showInfo = true,
  className = "",
  activeColor = "orange"
}: PaginationProps) {
  // Menghitung total halaman
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Menghitung indeks item pertama dan terakhir untuk informasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Text untuk menampilkan informasi item
  const displayInfo = `Menampilkan ${indexOfFirstItem + 1} - ${
    indexOfLastItem > totalItems ? totalItems : indexOfLastItem
  } dari ${totalItems} item`;

  /**
   * Fungsi untuk pindah ke halaman tertentu
   * @param {number} pageNumber - Nomor halaman yang akan ditampilkan
   */
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  /**
   * Komponen untuk menampilkan nomor halaman
   * @param {number} number - Nomor halaman
   * @param {boolean} isActive - Status halaman aktif
   * @returns {JSX.Element}
   */
  const PageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
    <button
      onClick={() => paginate(number)}
      className={`h-8 w-8 flex items-center justify-center mx-1 rounded-md border ${
        isActive
          ? `bg-${activeColor}-600 text-white border-${activeColor}-600`
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {number}
    </button>
  );

  // Jika tidak ada halaman, tidak perlu menampilkan pagination
  if (totalPages <= 1) return null;

  return (
    <div className={`mt-8 flex flex-col md:flex-row items-center justify-between ${className}`}>
      {/* Info pagination */}
      {showInfo && (
        <div className="text-sm text-gray-700 mb-4 md:mb-0">
          {displayInfo}
        </div>
      )}
      
      <div className="flex items-center">
        {/* Tombol First Page */}
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
        
        {/* Tombol Previous */}
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
        
        {/* Nomor-nomor halaman */}
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Logika untuk menampilkan halaman di sekitar halaman aktif
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
        
        {/* Tombol Next */}
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
        
        {/* Tombol Last Page */}
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
