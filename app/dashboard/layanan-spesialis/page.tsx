"use client";

import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify, mdiStethoscope } from "@mdi/js";
// Import semua icon dari library @mdi/js
import * as MDIIcons from "@mdi/js";
import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import { getLayananSpesialis, deleteLayananSpesialis, LayananSpesialisItem } from "@/app/services/layananSpesialisService";

/**
 * Fungsi untuk mendapatkan path ikon berdasarkan nama ikon secara dinamis
 * @param {string} iconName - Nama ikon dari backend, contoh: 'mdiLungs'
 * @returns {string} Path ikon atau path default jika tidak ditemukan
 */
const getIconPath = (iconName: string) => {
  // Mengakses seluruh koleksi icon dari MDIIcons secara dinamis
  // Jika icon ditemukan, gunakan icon tersebut, jika tidak gunakan icon default
  return (MDIIcons as {[key: string]: string})[iconName] || mdiStethoscope;
};

/**
 * Komponen utama untuk halaman Layanan Spesialis
 * @returns {JSX.Element}
 */
export default function LayananSpesialis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [layananSpesialis, setLayananSpesialis] = useState<LayananSpesialisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getLayananSpesialis({
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      });
      
      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setLayananSpesialis(paginationData.data);
        
        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data layanan spesialis");
        setLayananSpesialis([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLayananSpesialis([]);
      setTotalItems(0);
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
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteLayananSpesialis(id);
        
        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus layanan spesialis");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Gagal menghapus layanan spesialis");
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
            Layanan Spesialis
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
          href="/dashboard/layanan-spesialis/create"
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

      {/* Empty state - Perbaikan kondisi untuk menampilkan pesan */}
      {!loading && (!layananSpesialis || layananSpesialis.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Tidak ada layanan spesialis yang ditemukan.</p>
        </div>
      )}

      {/* Grid layanan spesialis */}
      {!loading && layananSpesialis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {layananSpesialis.map((layanan) => (
            <div
              key={layanan.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header dengan ikon lingkaran */}
              <div className="flex justify-center items-center py-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  {/* Gunakan getIconPath yang lebih dinamis */}
                  <Icon path={getIconPath(layanan.icon)} size={1.5} className="text-orange-600" />
                </div>
              </div>

              {/* Konten layanan */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {layanan.nama_layanan}
                </h2>
                {layanan.deskripsi && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {layanan.deskripsi.replace(/<[^>]*>/g, '').substring(0, 100)}
                  {layanan.deskripsi.length > 100 ? '...' : ''}
                  </p>
                )}
                
                {/* Tampilkan dokter terkait */}
                {layanan.dokter && layanan.dokter.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dokter Terkait:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-4">
                      {layanan.dokter.map((dokter) => (
                        <li key={dokter.id} className="mb-1">{dokter.nama_dokter}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/layanan-spesialis/edit/${layanan.slug}/${layanan.id}`}
                    className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(layanan.id)}
                    disabled={isDeleting}
                    className="flex cursor-pointer items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium py-2 px-4 rounded-md"
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

      {/* Pagination - Dengan informasi total dan halaman terakhir yang diperbarui */}
      {!loading && layananSpesialis.length > 0 && (
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
