"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify, mdiFilePdfBox, mdiDotsVertical, mdiEye } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getQualityIndicator, deleteQualityIndicator, QualityIndicatorItem } from "@/app/services/qualityIndicatorService";
import moment from "moment";
import 'moment/locale/id';
import Modal from "@/app/components/Modal";

export default function QualityIndicators() {
  const {
    items: qualityIndicator,
    totalItems,
    isLoading,
    searchInput,
    setSearchInput,
    submitSearch,
    page,
    setPage,
    perPage,
    deleteItem,
    isDeleting,
  } = usePaginatedList<QualityIndicatorItem>({ key: "quality-indicators", fetchList: getQualityIndicator, remove: deleteQualityIndicator });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [currentPdfTitle, setCurrentPdfTitle] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const formatDate = (date: string): string => moment(date).format("DD MMMM YYYY");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openDropdownId) return;
      const dropdown = dropdownRefs.current[openDropdownId];
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus indikator mutu ini?")) deleteItem(id);
  };

  const openPdfViewer = (url: string, title: string) => {
    setCurrentPdfUrl(`${BASE_URL}/storage/${url}`);
    setCurrentPdfTitle(title);
    setIsPdfModalOpen(true);
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Indikator Mutu
          </h1>
          <form onSubmit={submitSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
          href="/dashboard/media/quality-indicators/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Baru
        </Link>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {!isLoading && (!qualityIndicator || qualityIndicator.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada indikator mutu yang ditemukan.
          </p>
        </div>
      )}

      {!isLoading && qualityIndicator.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {qualityIndicator.map((indicator) => (
            <div
              key={indicator.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-visible"
            >
              {indicator.photo ? (
                <div className="w-full h-48">
                  <Image
                    src={`${BASE_URL}/storage/${indicator.photo}`}
                    alt={indicator.title}
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

              <div className="p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {formatDate(indicator.created_at)}
                </div>
                <h2 className="text-md lg:text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {indicator.title}
                </h2>
                <div className="flex justify-between">
                  <div className="relative" ref={(el) => { dropdownRefs.current[indicator.id] = el; }}>
                    <button
                      onClick={(e) => toggleDropdown(indicator.id, e)}
                      className="flex cursor-pointer items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-medium py-2 px-4 rounded-md"
                    >
                      Aksi
                      <Icon path={mdiDotsVertical} size={0.8} className="ml-2" />
                    </button>

                    {openDropdownId === indicator.id && (
                      <div
                        className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-[9999] border border-gray-200 dark:border-gray-700"
                        style={{
                          minWidth: '180px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <button
                          onClick={() => {
                            openPdfViewer(indicator.pdf_file, indicator.title);
                            setOpenDropdownId(null);
                          }}
                          className="flex cursor-pointer items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
                        >
                          <Icon path={mdiEye} size={0.8} className="mr-2 text-blue-600" />
                          Lihat PDF
                        </button>

                        <Link
                          href={`/dashboard/media/quality-indicators/edit/${indicator.slug}/${indicator.id}`}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Icon path={mdiPencil} size={0.8} className="mr-2 text-orange-600" />
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(indicator.id)}
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

      {!isLoading && qualityIndicator.length > 0 && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
          showInfo={true}
          activeColor="orange"
        />
      )}

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
