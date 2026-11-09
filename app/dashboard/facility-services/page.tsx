"use client";

import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getFacilityService, deleteFacilityService, FacilityServiceItem } from "@/app/services/facilityService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

export default function FacilityService() {
  const {
    items: facilityService,
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
  } = usePaginatedList<FacilityServiceItem>({ key: "facility-services", fetchList: getFacilityService, remove: deleteFacilityService });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan fasilitas ini?")) deleteItem(id);
  };

  return (
    <div className="page">
      <PageHeader title="Layanan & Fasilitas" description="Fasilitas dan layanan yang tersedia di klinik." actions={<AddButton href="/dashboard/facility-services/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan nama" }} />

      {isLoading && <LoadingState />}

      {!isLoading && (!facilityService || facilityService.length === 0) && (
        <EmptyState title="Tidak ada layanan & fasilitas yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && facilityService.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {facilityService.map((service) => (
            <div
              key={service.id} className="resource-card">
              <div className="h-48 overflow-hidden">
                <Image
                  src={`${BASE_URL}/storage/${service.header_photo}`}
                  alt={service.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="resource-card-body">
                <h2 className="resource-card-title">
                  {service.name}
                </h2>
                <CardActions editHref={`/dashboard/facility-services/edit/${service.slug}/${service.id}`} onDelete={() => handleDelete(service.id)} disabled={isDeleting} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && facilityService.length > 0 && (
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
