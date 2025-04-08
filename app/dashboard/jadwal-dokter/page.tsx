"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import {
  getJadwalDokter,
  deleteJadwalDokter,
  JadwalDokterItem,
} from "@/app/services/jadwalDokterService";
import { getMasterDokter, DokterItem } from "@/app/services/masterDokterService";
import { getLayananSpesialis, LayananSpesialisItem } from "@/app/services/layananSpesialisService";

/**
 * Interface untuk opsi dropdown
 */
interface OptionType {
  label: string;
  value: string;
}

/**
 * Komponen utama untuk halaman Jadwal Dokter
 * @returns {JSX.Element}
 */
export default function JadwalDokter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [jadwalDokter, setJadwalDokter] = useState<JadwalDokterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk filter dan modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterDokterId, setFilterDokterId] = useState("");
  const [filterSpesialisId, setFilterSpesialisId] = useState("");
  const [dokterOptions, setDokterOptions] = useState<OptionType[]>([]);
  const [spesialisOptions, setSpesialisOptions] = useState<OptionType[]>([]);
  const [loadingDokter, setLoadingDokter] = useState(false);
  const [loadingSpesialis, setLoadingSpesialis] = useState(false);

  /**
   * Fungsi untuk membuka modal filter
   */
  const openFilterModal = () => {
    fetchDokterOptions();
    fetchSpesialisOptions();
    setIsFilterModalOpen(true);
  };

  /**
   * Fungsi untuk memuat opsi dokter untuk filter
   */
  const fetchDokterOptions = async () => {
    try {
      setLoadingDokter(true);
      const response = await getMasterDokter({ per_page: 100 });
      
      if (response.success && response.data && response.data.data) {
        setDokterOptions(
          response.data.data.map((item: DokterItem) => ({
            label: item.nama_dokter,
            value: item.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching dokter options:", error);
    } finally {
      setLoadingDokter(false);
    }
  };

  /**
   * Fungsi untuk memuat opsi spesialis untuk filter
   */
  const fetchSpesialisOptions = async () => {
    try {
      setLoadingSpesialis(true);
      const response = await getLayananSpesialis({ per_page: 100 });
      
      if (response.success && response.data && response.data.data) {
        setSpesialisOptions(
          response.data.data.map((item: LayananSpesialisItem) => ({
            label: item.nama_layanan,
            value: item.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching spesialis options:", error);
    } finally {
      setLoadingSpesialis(false);
    }
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
   * Fungsi untuk mengambil data tanpa filter apapun
   */
  const fetchDataWithoutFilters = async () => {
    try {
      setLoading(true);
      // Reset semua state filter
      setFilterDokterId("");
      setFilterSpesialisId("");
      setSearchQuery("");
      setCurrentPage(1);
      
      // Panggil API tanpa parameter filter
      const params = {
        page: 1,
        per_page: itemsPerPage
      };
      
      const response = await getJadwalDokter(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setJadwalDokter(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data jadwal dokter");
        setJadwalDokter([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJadwalDokter([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset filter
   */
  const resetFilter = () => {
    // Panggil fungsi khusus untuk fetch data tanpa filter
    fetchDataWithoutFilters();
    // Tutup modal
    setIsFilterModalOpen(false);
  };

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      };

      // Tambahkan filter jika ada
      if (filterDokterId) {
        params.dokter_id = filterDokterId;
      }
      if (filterSpesialisId) {
        params.spesialis_id = filterSpesialisId;
      }

      const response = await getJadwalDokter(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setJadwalDokter(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data jadwal dokter");
        setJadwalDokter([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setJadwalDokter([]);
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
   * Fungsi untuk menghapus jadwal dokter
   * @param {string} id - ID jadwal dokter yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal dokter ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteJadwalDokter(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus jadwal dokter");
        }
      } catch (error) {
        console.error("Error deleting jadwal dokter:", error);
        alert("Gagal menghapus jadwal dokter");
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
            Jadwal Dokter
          </h1>
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama dokter"
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
          {/* Tombol Filter - Buka modal filter*/}
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          {/* Tombol Tambah Baru */}
          <Link
            href="/dashboard/jadwal-dokter/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Tambah Baru
          </Link>
        </div>
      </div>

      {/* Modal Filter */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Jadwal Dokter"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dokter
            </label>
            <select
              value={filterDokterId}
              onChange={(e) => setFilterDokterId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingDokter}
            >
              <option value="">Semua Dokter</option>
              {dokterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spesialis
            </label>
            <select
              value={filterSpesialisId}
              onChange={(e) => setFilterSpesialisId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingSpesialis}
            >
              <option value="">Semua Spesialis</option>
              {spesialisOptions.map((option) => (
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
      {!loading && (!jadwalDokter || jadwalDokter.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada jadwal dokter yang ditemukan.
          </p>
        </div>
      )}

      {/* Grid jadwal dokter */}
      {!loading && jadwalDokter.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {jadwalDokter.map((dokter) => (
            <div
              key={dokter.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Gambar dokter */}
              <div className="h-48 overflow-hidden">
                <Image
                  src={`${BASE_URL}/storage/${dokter.foto}`}
                  alt={dokter.dokter?.nama_dokter || "Dokter"}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Konten dokter */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {dokter.dokter?.nama_dokter || "Nama Dokter Tidak Tersedia"}
                </h2>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                  {dokter.spesialis?.nama_layanan || "Spesialis Tidak Tersedia"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {dokter.background_dokter}
                </p>
                <div className="flex justify-between">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/jadwal-dokter/edit/${dokter.id}`}
                    className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(dokter.id)}
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

      {/* Pagination */}
      {!loading && jadwalDokter.length > 0 && (
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
