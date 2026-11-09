"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiCalendar } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import { getCommunityEvent, deleteCommunityEvent, CommunityEventItem } from "@/app/services/communityEventService";
import moment from "moment";
import 'moment/locale/id';
import Select from 'react-select';
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

export default function CommunityEvent() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("CommunityEvent");

  const {
    items: events,
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
  } = usePaginatedList<CommunityEventItem>({
    key: "community-events",
    fetchList: getCommunityEvent,
    remove: deleteCommunityEvent,
    filters: appliedFilters,
    initialPerPage: 6,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const openFilterModal = () => setIsFilterModalOpen(true);

  const applyFilter = () => {
    setAppliedFilters({ category_id: filterCategoryId || undefined });
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilterCategoryId("");
    setAppliedFilters({});
    resetSearch();
    setIsFilterModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) deleteItem(id);
  };

  const formatDate = (date: string): string => {
    return moment(date).format('DD MMMM YYYY');
  };

  return (
    <div className="page">
      <PageHeader title="Event & Community" description="Event dan kegiatan komunitas klinik." actions={<AddButton href="/dashboard/media/community-events/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan judul" }} onFilter={openFilterModal} />

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

      {!isLoading && (!events || events.length === 0) && (
        <EmptyState title="Tidak ada data event & community yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {events.map((event) => (
            <div
              key={event.id} className="resource-card">
              <Image
                src={event.photo ? `${BASE_URL}/storage/${event.photo}` : "/placeholder-image.jpg"}
                alt={event.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />

              <div className="resource-card-body">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <Icon path={mdiCalendar} size={0.8} />
                  {formatDate(event.created_at)}
                </div>
                <h2 className="text-sm md:text-md lg:text-lg leading-[25px] font-semibold text-gray-800 dark:text-white mb-4">
                  {event.title}
                </h2>
                <CardActions editHref={`/dashboard/media/community-events/edit/${event.slug}/${event.id}`} onDelete={() => handleDelete(event.id)} disabled={isDeleting} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && events.length > 0 && (
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
