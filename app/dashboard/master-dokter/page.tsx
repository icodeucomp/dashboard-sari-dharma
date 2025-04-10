"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import {
  getMasterDokter,
  deleteMasterDokter,
  DokterItem,
  PaginationParams,
} from "@/app/services/masterDokterService";

/**
 * Komponen utama untuk halaman Master Dokter
 * @returns {JSX.Element}
 */
export default function MasterDokter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dokterList, setDokterList] = useState<DokterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const params: PaginationParams = {
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      };

      const response = await getMasterDokter(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setDokterList(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data master dokter");
        setDokterList([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDokterList([]);
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
   * Fungsi untuk menghapus data dokter
   * @param {string} id - ID dokter yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokter ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteMasterDokter(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus dokter");
        }
      } catch (error) {
        console.error("Error deleting dokter:", error);
        alert("Gagal menghapus dokter");
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
            Master Dokter
          </h1>
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dokter"
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
          href="/dashboard/master-dokter/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Dokter
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && (!dokterList || dokterList.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada data dokter yang ditemukan.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && dokterList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Foto
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Nama Dokter
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dokterList.map((dokter) => (
                  <tr key={dokter.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {dokter.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={dokter.foto ? `${BASE_URL}/storage/${dokter.foto}` : "/user.svg"}
                          alt={dokter.nama_dokter}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {dokter.nama_dokter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          href={`/dashboard/master-dokter/edit/${dokter.id}`}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          <Icon path={mdiPencil} size={1} />
                        </Link>
                        <button
                          onClick={() => handleDelete(dokter.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon path={mdiTrashCan} size={1} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showInfo={true}
            activeColor="orange"
          />
        </div>
      )}
    </div>
  );
}