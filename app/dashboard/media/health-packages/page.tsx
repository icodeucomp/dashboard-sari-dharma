"use client";

import { useState } from "react";
import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import { getHealthPackage, deleteHealthPackage, HealthPackageItem } from "@/app/services/healthPackageService";
import moment from "moment";
import 'moment/locale/id';
import Select from 'react-select';
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

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
    <div className="page">
      <PageHeader title="Paket Kesehatan" description="Paket pemeriksaan dan promo kesehatan." actions={<AddButton href="/dashboard/media/health-packages/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan nama" }} onFilter={openFilterModal} />

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
              className="form-input"
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
              className="form-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={resetFilter}
              className="btn btn-outline"
            >
              Reset
            </button>
            <button
              onClick={applyFilter}
              className="btn btn-primary"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </Modal>

      {isLoading && <LoadingState />}

      {!isLoading && (!healthPackage || healthPackage.length === 0) && (
        <EmptyState title="Tidak ada paket kesehatan yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && healthPackage.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {healthPackage.map((pkg) => (
            <div
              key={pkg.id} className="resource-card">
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

              <div className="resource-card-body">
                <h2 className="resource-card-title">
                  {pkg.name}
                </h2>
                <CardActions editHref={`/dashboard/media/health-packages/edit/${pkg.slug}/${pkg.id}`} onDelete={() => handleDelete(pkg.id)} disabled={isDeleting} />
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
