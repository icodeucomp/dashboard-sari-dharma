"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiFilePdfBox } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getQualityIndicator, deleteQualityIndicator, QualityIndicatorItem } from "@/app/services/qualityIndicatorService";
import moment from "moment";
import 'moment/locale/id';
import Modal from "@/app/components/Modal";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

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
  const formatDate = (date: string): string => moment(date).format("DD MMMM YYYY");

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus indikator mutu ini?")) deleteItem(id);
  };

  const openPdfViewer = (url: string, title: string) => {
    setCurrentPdfUrl(`${BASE_URL}/storage/${url}`);
    setCurrentPdfTitle(title);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="page">
      <PageHeader title="Indikator Mutu" description="Laporan indikator mutu klinik." actions={<AddButton href="/dashboard/media/quality-indicators/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan judul" }} />

      {isLoading && <LoadingState />}

      {!isLoading && (!qualityIndicator || qualityIndicator.length === 0) && (
        <EmptyState title="Tidak ada indikator mutu yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && qualityIndicator.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {qualityIndicator.map((indicator) => (
            <div
              key={indicator.id} className="resource-card">
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

              <div className="resource-card-body">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {formatDate(indicator.created_at)}
                </div>
                <h2 className="resource-card-title">
                  {indicator.title}
                </h2>
                <CardActions
                  viewLabel="Lihat PDF"
                  onView={() => openPdfViewer(indicator.pdf_file, indicator.title)}
                  editHref={`/dashboard/media/quality-indicators/edit/${indicator.slug}/${indicator.id}`}
                  onDelete={() => handleDelete(indicator.id)}
                  disabled={isDeleting}
                />
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
