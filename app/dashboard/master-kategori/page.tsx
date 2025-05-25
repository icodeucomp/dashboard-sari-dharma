"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import {
  getMasterKategori,
  deleteMasterKategori,
  Kategori,
  GetKategoriParams,
} from "@/app/services/masterKategoriService";

/**
 * Komponen utama untuk halaman Master Kategori
 * @returns {JSX.Element}
 */
export default function MasterKategori() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  // State untuk filter dan modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFlag, setFilterFlag] = useState("");

  /**
   * Opsi flag untuk filter
   */
  const flagOptions = [
    { value: "PaketKesehatan", label: "Paket Kesehatan" },
    { value: "ArtikelKesehatan", label: "Artikel Kesehatan" },
    { value: "EventCommunity", label: "Event & Community" },
    { value: "KarirKlinik", label: "Karir Klinik" },
    { value: "IndikatorMutu", label: "Indikator Mutu" },
  ];

  /**
   * Fungsi untuk membuka modal filter
   */
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  /**
   * Fungsi untuk menerapkan filter
   */
  const applyFilter = () => {
    setCurrentPage(1); // Reset ke halaman pertama
    fetchData(); // Reload data dengan filter
    setIsFilterModalOpen(false); // Tutup modal
  };

  /**
   * Fungsi untuk mengambil data dengan reset filter
   */
  const fetchDataWithoutFilters = async () => {
    try {
      setLoading(true);
      // Reset semua state filter
      setFilterFlag("");
      setSearchQuery("");
      setCurrentPage(1);
      
      // Panggil API tanpa parameter filter
      const params = {
        page: 1,
        per_page: itemsPerPage
      };
      
      const response = await getMasterKategori(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setKategoriList(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data kategori");
        setKategoriList([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setKategoriList([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset filter
   */
  const resetFilter = () => {
    fetchDataWithoutFilters();
    setIsFilterModalOpen(false);
  };

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const params: GetKategoriParams = {
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      };

      // Tambahkan filter jika ada
      if (filterFlag) {
        params.flag = filterFlag;
      }

      const response = await getMasterKategori(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setKategoriList(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data kategori");
        setKategoriList([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setKategoriList([]);
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
   * Fungsi untuk menghapus kategori
   * @param {string} id - ID kategori yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteMasterKategori(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus kategori");
        }
      } catch (error) {
        console.error("Error deleting kategori:", error);
        alert("Gagal menghapus kategori");
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

  /**
   * Fungsi untuk menampilkan label flag yang lebih bersahabat
   * @param {string} flag - Flag kategori
   * @returns {string} - Label yang mudah dibaca
   */
  const getFlagLabel = (flag: string): string => {
    const option = flagOptions.find(opt => opt.value === flag);
    return option ? option.label : flag;
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Master Kategori
          </h1>
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kategori"
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
        <div className="flex gap-4">
          {/* Tombol Filter */}
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          {/* Tombol Tambah Baru */}
          <Link
            href="/dashboard/master-kategori/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Tambah Kategori
          </Link>
        </div>
      </div>

      {/* Modal Filter */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Kategori"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Flag
            </label>
            <select
              value={filterFlag}
              onChange={(e) => setFilterFlag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Flag</option>
              {flagOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={resetFilter}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Reset
            </button>
            <button
              onClick={applyFilter}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && (!kategoriList || kategoriList.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada kategori yang ditemukan.
          </p>
        </div>
      )}

      {/* Tabel Kategori */}
      {!loading && kategoriList.length > 0 && (
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
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Page
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Flag
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
                {kategoriList.map((kategori) => (
                  <tr key={kategori.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {kategori.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {kategori.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {kategori.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {getFlagLabel(kategori.flag)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          href={`/dashboard/master-kategori/edit/${kategori.id}`}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                        >
                          <Icon path={mdiPencil} size={1} />
                        </Link>
                        <button
                          onClick={() => handleDelete(kategori.id)}
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