"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify, mdiCalendar, mdiFilter } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import Modal from "@/app/components/Modal";
import {
  getEventCommunity,
  deleteEventCommunity,
  EventCommunityItem
} from "@/app/services/eventCommunityService";
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
 * Komponen utama untuk halaman Event & Community
 * @returns {JSX.Element}
 */
export default function EventCommunity() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [events, setEvents] = useState<EventCommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [, setLastPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk filter dan modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterKategoriId, setFilterKategoriId] = useState("");
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
        flag: 'EventCommunity',
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
      setSearchQuery("");
      setCurrentPage(1);
      
      // Panggil API tanpa parameter filter
      const params = {
        page: 1,
        per_page: itemsPerPage
      };
      
      const response = await getEventCommunity(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setEvents(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data event & community");
        setEvents([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEvents([]);
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

      const response = await getEventCommunity(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setEvents(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setLastPage(paginationData.last_page);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data event & community");
        setEvents([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEvents([]);
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
   * Fungsi untuk menghapus event & community
   * @param {string} id - ID event & community yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteEventCommunity(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus data");
        }
      } catch (error) {
        console.error("Error deleting event & community:", error);
        alert("Gagal menghapus data");
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
   * Fungsi untuk memformat tanggal
   * @param {string} date - Tanggal yang akan diformat
   * @returns {string} - Tanggal yang telah diformat
   */
  const formatDate = (date: string): string => {
    return moment(date).format('DD MMMM YYYY');
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Event & Community
          </h1>
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul"
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
            href="/dashboard/media/event-community/create"
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
        title="Filter Event & Community"
        size="md"
      >
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
      {!loading && (!events || events.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada data event & community yang ditemukan.
          </p>
        </div>
      )}

      {/* Grid event & community */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {/* Gambar event */}
              <Image
                src={event.foto ? `${BASE_URL}/storage/${event.foto}` : "/placeholder-image.jpg"}
                alt={event.judul}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />

              {/* Konten event */}
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Icon path={mdiCalendar} size={0.8} className="mr-2" />
                  {formatDate(event.created_at)}
                </div>
                <h2 className="text-sm md:text-md lg:text-lg leading-[25px] font-semibold text-gray-800 dark:text-white mb-4">
                  {event.judul}
                </h2>
                <div className="flex justify-between">
                  {/* Tombol Edit */}
                  <Link
                    href={`/dashboard/media/event-community/edit/${event.slug}/${event.id}`}
                    className="flex items-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(event.id)}
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

      {/* Pagination */}
      {!loading && events.length > 0 && (
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
