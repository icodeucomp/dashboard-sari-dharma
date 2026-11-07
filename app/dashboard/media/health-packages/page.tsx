"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import { getHealthPackage, deleteHealthPackage, HealthPackageItem } from "@/app/services/healthPackageService";
import moment from "moment";
import 'moment/locale/id';
import Select from 'react-select';

export default function HealthPackage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterPromo, setFilterPromo] = useState<number | null>(null);
  const [filterValidStart, setFilterValidStart] = useState("");
  const [filterValidEnd, setFilterValidEnd] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("HealthPackage");

  const {
    items: healthPackage,
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
  } = usePaginatedList<HealthPackageItem>({
    key: "health-packages",
    fetchList: getHealthPackage,
    remove: deleteHealthPackage,
    filters: appliedFilters,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const openFilterModal = () => setIsFilterModalOpen(true);

  const applyFilter = () => {
    setAppliedFilters({
      category_id: filterCategoryId || undefined,
      promo: filterPromo ?? undefined,
      valid_start: filterValidStart || undefined,
      valid_end: filterValidEnd || undefined,
    });
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilterCategoryId("");
    setFilterPromo(null);
    setFilterValidStart("");
    setFilterValidEnd("");
    setAppliedFilters({});
    resetSearch();
    setIsFilterModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket kesehatan ini?")) deleteItem(id);
  };

  const formatValidUntil = (date: string | null): string => {
    if (!date) return "Tidak ada batas waktu";
    return `*Berlaku s/d ${moment(date).format("DD MMMM YYYY")}`;
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Paket Kesehatan
          </h1>
          <form onSubmit={submitSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          <Link
            href="/dashboard/media/health-packages/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Tambah Baru
          </Link>
        </div>
      </div>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Paket Kesehatan"
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
              onChange={selected => setFilterCategoryId(selected ? selected.value : "")}
              isClearable
              placeholder="Pilih kategori..."
              isDisabled={loadingCategory || isLoading}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Berlaku Dari
            </label>
            <input
              type="date"
              value={filterValidStart}
              onChange={(e) => setFilterValidStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Berlaku Sampai
            </label>
            <input
              type="date"
              value={filterValidEnd}
              onChange={(e) => setFilterValidEnd(e.target.value)}
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

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {!isLoading && (!healthPackage || healthPackage.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada paket kesehatan yang ditemukan.
          </p>
        </div>
      )}

      {!isLoading && healthPackage.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {healthPackage.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={`${BASE_URL}/storage/${pkg.photo}`}
                  alt={pkg.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {pkg.valid_until && (
                  <div className="absolute bottom-0 left-0 bg-[#FB973B] text-white text-xs font-medium px-2 py-1">
                    {formatValidUntil(pkg.valid_until)}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {pkg.name}
                </h2>
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/media/health-packages/edit/${pkg.slug}/${pkg.id}`}
                    className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  <button
                    onClick={() => handleDelete(pkg.id)}
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

      {!isLoading && healthPackage.length > 0 && (
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
