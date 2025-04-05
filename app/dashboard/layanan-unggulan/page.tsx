"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { getLayananUnggulan, deleteLayananUnggulan, LayananUnggulanItem } from "@/app/services/layananUnggulanService";

/**
 * Komponen utama untuk halaman Layanan Unggulan
 * @returns {JSX.Element}
 */
export default function LayananUnggulan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [layananUnggulan, setLayananUnggulan] = useState<LayananUnggulanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getLayananUnggulan({
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      });
      
      if (response.success) {
        // Mengakses data items dari struktur pagination
        setLayananUnggulan(response.data.data);
        // Set informasi pagination
        setTotalItems(response.data.total);
        setLastPage(response.data.last_page);
        setItemsPerPage(response.data.per_page);
      } else {
        console.error("Gagal mengambil data layanan unggulan");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount atau parameter berubah
   */
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  /**
   * Fungsi untuk menghapus layanan
   * @param {number} id - ID layanan yang akan dihapus
   */
  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteLayananUnggulan(id);
        
        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Gagal menghapus layanan");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  /**
   * Fungsi untuk mengganti halaman
   * @param {number} pageNumber - Nomor halaman yang akan ditampilkan
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Fungsi untuk menangani pencarian
   * @param {React.FormEvent} e - Event form
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman pertama setelah pencarian
    fetchData();
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Layanan Unggulan
          </h1>
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama"
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
        <Link
          href="/dashboard/layanan-unggulan/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Baru
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && layananUnggulan.length === 0 && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Tidak ada layanan unggulan yang ditemukan.</p>
        </div>
      )}

      {/* Grid layanan unggulan */}
      {!loading && layananUnggulan.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {layananUnggulan.map((layanan) => (
            <div
              key={layanan.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
            >
              {/* Gambar layanan */}
              <div className="w-full h-48 relative">
                <Image
                  src={`${BASE_URL}/storage/${layanan.foto}`}
                  alt={layanan.nama_layanan}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Konten layanan */}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {layanan.nama_layanan}
                </h2>
                <div className="mt-auto flex justify-between">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/layanan-unggulan/edit/${layanan.id}`}
                    className="flex items-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(layanan.id)}
                    disabled={isDeleting}
                    className="flex cursor-pointer items-center border border-orange-600 text-red-600 hover:bg-orange-600 hover:text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Hapus
                    <Icon path={mdiTrashCan} size={0.8} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination Component */}
      {!loading && layananUnggulan.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showInfo={true}
          activeColor="orange"
        />
      )}
    </div>
  );
}
