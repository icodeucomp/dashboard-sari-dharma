"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify, mdiTag, mdiCalendar } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useCategoryOptions, useDoctorOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import moment from "moment";
import 'moment/locale/id';
import Select from "react-select";
import { getHealthArticle, deleteHealthArticle, HealthArticleItem } from "@/app/services/healthArticleService";

interface OptionType {
  label: string;
  value: string;
}

export default function HealthArticle() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterDoctorIds, setFilterDoctorIds] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("HealthArticle");
  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();

  const {
    items: healthArticle,
    totalItems,
    isLoading,
    searchInput,
    setSearchInput,
    submitSearch,
    resetSearch,
    page,
    setPage,
    perPage,
    deleteItem,
    isDeleting,
  } = usePaginatedList<HealthArticleItem>({
    key: "health-articles",
    fetchList: getHealthArticle,
    remove: deleteHealthArticle,
    filters: appliedFilters,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const openFilterModal = () => setIsFilterModalOpen(true);

  const applyFilter = () => {
    setAppliedFilters({ category_id: filterCategoryId || undefined, related_doctors: filterDoctorIds.length > 0 ? filterDoctorIds : undefined });
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilterCategoryId("");
    setFilterDoctorIds([]);
    setAppliedFilters({});
    resetSearch();
    setIsFilterModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel kesehatan ini?")) deleteItem(id);
  };

  const handleDoctorChange = (selected: readonly OptionType[]) => {
    const selectedIds = selected.map(option => option.value);
    setFilterDoctorIds(selectedIds);
  };

  const formatDate = (date: string): string => {
    return moment(date).format('DD MMMM YYYY');
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Artikel Kesehatan
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
        <div className="flex gap-4">
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          <Link
            href="/dashboard/media/health-articles/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Tambah Baru
          </Link>
        </div>
      </div>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Artikel Kesehatan"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategori
            </label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === filterCategoryId) || null}
              onChange={(selected: OptionType | null) => {
                setFilterCategoryId(selected ? selected.value : "");
              }}
              isClearable
              placeholder="Pilih kategori..."
              isDisabled={loadingCategory || isLoading}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dokter Terkait
            </label>
            <Select
              isMulti
              options={doctorOptions}
              value={doctorOptions.filter(option => filterDoctorIds.includes(option.value))}
              onChange={handleDoctorChange}
              isLoading={loadingDoctor}
              isDisabled={isLoading}
              placeholder="Pilih dokter..."
              noOptionsMessage={() => "Tidak ada pilihan dokter"}
              loadingMessage={() => "Memuat data dokter..."}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                  boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
                  '&:hover': {
                    borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
                  },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#f3f4f6',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: '#4b5563',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: '#6b7280',
                  '&:hover': {
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                  },
                }),
              }}
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

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {!isLoading && (!healthArticle || healthArticle.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada artikel kesehatan yang ditemukan.
          </p>
        </div>
      )}

      {!isLoading && healthArticle.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
          {healthArticle.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={article.photo ? `${BASE_URL}/storage/${article.photo}` : "/placeholder-image.jpg"}
                alt={article.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />

              <div className="px-4 py-2 mt-4">
                <div className="inline-flex items-center gap-2 bg-[#FB973B] text-white text-sm font-medium px-3 py-1 rounded-md">
                  <Icon path={mdiTag} size={0.8} />
                  {article.category?.name || "Tidak ada kategori"}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Icon path={mdiCalendar} size={0.8} className="mr-2" />
                  {formatDate(article.created_at)}
                </div>
                <h2 className="text-sm md:text-md lg:text-lg leading-[25px] font-semibold text-gray-800 dark:text-white mb-4">
                  {article.title}
                </h2>
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/media/health-articles/edit/${article.slug}/${article.id}`}
                    className="flex items-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  <button
                    onClick={() => handleDelete(article.id)}
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

      {!isLoading && healthArticle.length > 0 && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={perPage}
          onPageChange={setPage}
          showInfo={true}
          activeColor="orange"
        />
      )}
    </div>
  );
}
