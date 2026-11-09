"use client";

import { useState } from "react";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import Modal from "@/app/components/Modal";
import { getMasterCategory, deleteMasterCategory, Category } from "@/app/services/masterCategoryService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, RowActions } from "@/app/components/ui";

export default function MasterCategory() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterFlag, setFilterFlag] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});

  const {
    items: categoryList,
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
  } = usePaginatedList<Category>({
    key: "categories",
    fetchList: getMasterCategory,
    remove: deleteMasterCategory,
    filters: appliedFilters,
  });

  const openFilterModal = () => setIsFilterModalOpen(true);

  const applyFilter = () => {
    setAppliedFilters({ flag: filterFlag || undefined });
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilterFlag("");
    setAppliedFilters({});
    resetSearch();
    setIsFilterModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) deleteItem(id);
  };

  const flagOptions = [
    { value: "HealthPackage", label: "Paket Kesehatan" },
    { value: "HealthArticle", label: "Artikel Kesehatan" },
    { value: "CommunityEvent", label: "Event & Community" },
    { value: "CareerClinic", label: "Karir Klinik" },
    { value: "QualityIndicator", label: "Indikator Mutu" },
  ];

  const getFlagLabel = (flag: string): string => {
    const option = flagOptions.find(opt => opt.value === flag);
    return option ? option.label : flag;
  };

  return (
    <div className="page">
      <PageHeader title="Master Kategori" description="Kategori untuk artikel, paket kesehatan, event dan karir." actions={<AddButton href="/dashboard/categories/create" label="Tambah Kategori" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari kategori" }} onFilter={openFilterModal} />

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
              className="form-input"
            >
              <option value="">Semua Flag</option>
              {flagOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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

      {!isLoading && (!categoryList || categoryList.length === 0) && (
        <EmptyState title="Tidak ada kategori yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && categoryList.length > 0 && (
        <div className="table-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Flag
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categoryList.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        {getFlagLabel(category.flag)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <RowActions editHref={`/dashboard/categories/edit/${category.id}`} onDelete={() => handleDelete(category.id)} disabled={isDeleting} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={perPage}
            onPageChange={setPage}
            showInfo={true}
            activeColor="orange"
            className="border-t border-gray-200 px-4 py-3 dark:border-gray-700"
          />
        </div>
      )}
    </div>
  );
}