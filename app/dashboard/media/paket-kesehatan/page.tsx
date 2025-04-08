"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import {
  getPaketKesehatan,
  deletePaketKesehatan,
  PaketKesehatanItem
} from "@/app/services/paketKesehatanService";
import { getKategoriList } from "@/app/services/masterKategoriService";
import moment from "moment";
import 'moment/locale/id';
import Select from 'react-select';

/**
 * Interface untuk opsi dropdown kategori
 */
interface OptionType {
  label: string;
  value: string;
}

/**
 * Komponen utama untuk halaman Paket Kesehatan
 * @returns {JSX.Element}
 */
export default function PaketKesehatan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paketKesehatan, setPaketKesehatan] = useState<PaketKesehatanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk filter dan modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterKategoriId, setFilterKategoriId] = useState("");
  const [filterPromo, setFilterPromo] = useState<number | null>(null);
  const [filterBerlakuStart, setFilterBerlakuStart] = useState("");
  const [filterBerlakuEnd, setFilterBerlakuEnd] = useState("");
  const [kategoriOptions, setKategoriOptions] = useState<OptionType[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(false);

  /**
   * Fungsi untuk membuka modal filter
   */
  const openFilterModal = () => {
    fetchKategoriOptions();
    setIsFilterModalOpen(true);
  };

  /**
   * Fungsi untuk memuat opsi kategori untuk filter
   */
  const fetchKategoriOptions = async () => {
    try {
      setLoadingKategori(true);
      const response = await getKategoriList({
        flag: 'PaketKesehatan',
        per_page: 100
      });
      
      if (response.success && Array.isArray(response.data)) {
        setKategoriOptions(
          response.data.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching kategori options:", error);
    } finally {
      setLoadingKategori(false);
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
      setFilterKategoriId("");
      setFilterPromo(null);
      setFilterBerlakuStart("");
      setFilterBerlakuEnd("");
      setSearchQuery("");
      setCurrentPage(1);
      
      // Panggil API tanpa parameter filter
      const params = {
        page: 1,
        per_page: itemsPerPage
      };
      
      const response = await getPaketKesehatan(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setPaketKesehatan(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data paket kesehatan");
        setPaketKesehatan([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPaketKesehatan([]);
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
   * Fungsi untuk memuat data dari API dengan filter
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
      if (filterKategoriId) {
        params.kategori_id = filterKategoriId;
      }
      if (filterPromo !== null) {
        params.promo = filterPromo;
      }
      if (filterBerlakuStart) {
        params.berlaku_start = filterBerlakuStart;
      }
      if (filterBerlakuEnd) {
        params.berlaku_end = filterBerlakuEnd;
      }

      const response = await getPaketKesehatan(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setPaketKesehatan(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data paket kesehatan");
        setPaketKesehatan([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPaketKesehatan([]);
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
   * Fungsi untuk menghapus paket kesehatan
   * @param {string} id - ID paket kesehatan yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket kesehatan ini?")) {
      try {
        setIsDeleting(true);
        const response = await deletePaketKesehatan(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus paket kesehatan");
        }
      } catch (error) {
        console.error("Error deleting paket kesehatan:", error);
        alert("Gagal menghapus paket kesehatan");
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
   * Fungsi untuk meformat tanggal berlaku sampai
   * @param {string|null} date - Tanggal berlaku sampai
   * @returns {string} - Tanggal yang telah diformat atau pesan default
   */
  const formatBerlakuSampai = (date: string | null): string => {
    if (!date) return "Tidak ada batas waktu";
    return `*Berlaku s/d ${moment(date).format('DD MMMM YYYY')}`;
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Paket Kesehatan
          </h1>
          {/* Search Box */}
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
        <div className="flex gap-4">
          {/* Tombol Filter */}
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          {/* Tombol Tambah Baru */}
          <Link
            href="/dashboard/media/paket-kesehatan/create"
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
        title="Filter Paket Kesehatan"
        size="md"
      >
        {/* Komentar: Fungsi untuk menampilkan filter kategori dengan react-select */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <Select
              options={kategoriOptions}
              value={kategoriOptions.find(option => option.value === filterKategoriId) || null}
              onChange={selected => setFilterKategoriId(selected ? selected.value : "")}
              isClearable
              placeholder="Pilih kategori..."
              isDisabled={loadingKategori || loading}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Promo
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filterPromo"
                  checked={filterPromo === null}
                  onChange={() => setFilterPromo(null)}
                  className="mr-2"
                />
                Semua
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filterPromo"
                  checked={filterPromo === 1}
                  onChange={() => setFilterPromo(1)}
                  className="mr-2"
                />
                Ya
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="filterPromo"
                  checked={filterPromo === 0}
                  onChange={() => setFilterPromo(0)}
                  className="mr-2"
                />
                Tidak
              </label>
            </div>
          </div>

          {/* Filter Berlaku Dari (Start) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Berlaku Dari
            </label>
            <input
              type="date"
              value={filterBerlakuStart}
              onChange={(e) => setFilterBerlakuStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filter Berlaku Sampai (End) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Berlaku Sampai
            </label>
            <input
              type="date"
              value={filterBerlakuEnd}
              onChange={(e) => setFilterBerlakuEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
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
      {!loading && (!paketKesehatan || paketKesehatan.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada paket kesehatan yang ditemukan.
          </p>
        </div>
      )}

      {/* Grid paket kesehatan */}
      {!loading && paketKesehatan.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {paketKesehatan.map((paket) => (
            <div
              key={paket.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Gambar paket */}
              <div className="relative">
                <Image
                  src={`${BASE_URL}/storage/${paket.foto}`}
                  alt={paket.nama_paket}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {/* Informasi berlaku */}
                {paket.berlaku_sampai && (
                  <div className="absolute bottom-0 left-0 bg-[#FB973B] text-white text-xs font-medium px-2 py-1">
                    {formatBerlakuSampai(paket.berlaku_sampai)}
                  </div>
                )}
              </div>

              {/* Konten paket */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {paket.nama_paket}
                </h2>
                <div className="flex justify-between">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/media/paket-kesehatan/edit/${paket.slug}/${paket.id}`}
                    className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(paket.id)}
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
      {!loading && paketKesehatan.length > 0 && (
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
