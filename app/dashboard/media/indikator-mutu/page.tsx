"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { 
  mdiPencil, 
  mdiTrashCan, 
  mdiMagnify, 
  mdiFilePdfBox, 
  mdiDotsVertical, 
  mdiEye 
} from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { 
  getIndikatorMutu, 
  deleteIndikatorMutu, 
  IndikatorMutuItem 
} from "@/app/services/indikatorMutuService";
import moment from "moment";
import 'moment/locale/id';
import Modal from "@/app/components/Modal";

/**
 * Komponen utama untuk halaman Indikator Mutu
 * @returns {JSX.Element}
 */
export default function IndikatorMutu() {
  // State untuk data dan filter
  const [indikatorMutu, setIndikatorMutu] = useState<IndikatorMutuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk modal PDF viewer
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [currentPdfTitle, setCurrentPdfTitle] = useState("");

  // State untuk dropdown menu
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  /**
   * Fungsi untuk memuat data dari API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage,
      };

      const response = await getIndikatorMutu(params);

      if (response.success) {
        // Ekstrak data dari struktur pagination
        const paginationData = response.data;
        setIndikatorMutu(paginationData.data);

        // Set informasi pagination
        setTotalItems(paginationData.total);
        setItemsPerPage(paginationData.per_page);
        setCurrentPage(paginationData.current_page);
      } else {
        console.error("Gagal mengambil data indikator mutu");
        setIndikatorMutu([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIndikatorMutu([]);
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
   * Fungsi untuk menghapus indikator mutu
   * @param {string} id - ID indikator mutu yang akan dihapus
   */
  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus indikator mutu ini?")) {
      try {
        setIsDeleting(true);
        const response = await deleteIndikatorMutu(id);

        if (response.success) {
          // Refresh data setelah berhasil menghapus
          fetchData();
        } else {
          alert("Gagal menghapus indikator mutu");
        }
      } catch (error) {
        console.error("Error deleting indikator mutu:", error);
        alert("Gagal menghapus indikator mutu");
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

  /**
   * Fungsi untuk membuka modal PDF viewer
   * @param {string} url - URL file PDF yang akan ditampilkan
   * @param {string} title - Judul PDF yang akan ditampilkan
   */
  const openPdfViewer = (url: string, title: string) => {
    setCurrentPdfUrl(`${BASE_URL}/storage/${url}`);
    setCurrentPdfTitle(title);
    setIsPdfModalOpen(true);
  };

  /**
   * Fungsi untuk toggle dropdown menu
   * @param {string} id - ID dari indikator mutu yang dropdownnya akan di-toggle
   * @param {React.MouseEvent} e - Event mouse click
   */
  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah event bubble ke document
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  /**
   * Effect untuk menambahkan event listener penanganan klik di luar dropdown
   */
  useEffect(() => {
    /**
     * Fungsi untuk menutup dropdown ketika user klik di luar area dropdown
     * @param {MouseEvent} event - Mouse event
     */
    const handleClickOutside = (event: MouseEvent) => {
      // Jika ada dropdown yang terbuka
      if (openDropdownId) {
        // Ambil ref untuk dropdown yang sedang terbuka
        const dropdownRef = dropdownRefs.current[openDropdownId];
        
        // Jika klik terjadi di luar dropdown, tutup dropdown
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          setOpenDropdownId(null);
        }
      }
    };

    // Tambahkan event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener saat komponen unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Indikator Mutu
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
        <Link
          href="/dashboard/media/indikator-mutu/create"
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
      {!loading && (!indikatorMutu || indikatorMutu.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada indikator mutu yang ditemukan.
          </p>
        </div>
      )}

      {/* Grid indikator mutu */}
      {!loading && indikatorMutu.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {indikatorMutu.map((indikator) => (
            <div
              key={indikator.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible"
            >
              {/* Gambar atau Icon */}
              {indikator.foto ? (
                <div className="w-full h-48">
                  <Image
                    src={`${BASE_URL}/storage/${indikator.foto}`}
                    alt={indikator.judul}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Icon 
                    path={mdiFilePdfBox} 
                    size={3.5} 
                    className="text-red-600 dark:text-red-400" 
                  />
                </div>
              )}

              {/* Konten indikator mutu */}
              <div className="p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {formatDate(indikator.created_at)}
                </div>
                <h2 className="text-md lg:text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {indikator.judul}
                </h2>
                <div className="flex justify-between">
                  {/* Dropdown Menu */}
                  <div className="relative" ref={(el) => { dropdownRefs.current[indikator.id] = el; }}>
                    <button
                      onClick={(e) => toggleDropdown(indikator.id, e)}
                      className="flex cursor-pointer items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-medium py-2 px-4 rounded-md"
                    >
                      Aksi
                      <Icon path={mdiDotsVertical} size={0.8} className="ml-2" />
                    </button>
                    
                    {/* Dropdown Content - Perbaikan posisi */}
                    {openDropdownId === indikator.id && (
                      <div 
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-[9999] border border-gray-200 dark:border-gray-700"
                        style={{ 
                          minWidth: '180px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <button
                          onClick={() => {
                            openPdfViewer(indikator.file_pdf, indikator.judul);
                            setOpenDropdownId(null); // Tutup dropdown setelah klik
                          }}
                          className="flex cursor-pointer items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
                        >
                          <Icon path={mdiEye} size={0.8} className="mr-2 text-blue-600" />
                          Lihat PDF
                        </button>
                        
                        <Link
                          href={`/dashboard/media/indikator-mutu/edit/${indikator.slug}/${indikator.id}`}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Icon path={mdiPencil} size={0.8} className="mr-2 text-orange-600" />
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(indikator.id)}
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
      {!loading && indikatorMutu.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showInfo={true}
          activeColor="orange"
        />
      )}

      {/* Modal PDF Viewer */}
      <Modal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title={currentPdfTitle}
        size="3xl"
      >
        <div className="w-full h-[80vh]">
          <iframe
            src={`${currentPdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={currentPdfTitle}
          />
        </div>
      </Modal>
    </div>
  );
}
