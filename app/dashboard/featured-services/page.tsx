"use client";

import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getFeaturedService, deleteFeaturedService, FeaturedServiceItem } from "@/app/services/featuredService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

export default function FeaturedService() {
  const {
    items: featuredService,
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
  } = usePaginatedList<FeaturedServiceItem>({ key: "featured-services", fetchList: getFeaturedService, remove: deleteFeaturedService });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) deleteItem(id);
  };

  return (
    <div className="page">
      <PageHeader title="Layanan Unggulan" description="Layanan unggulan yang tampil di halaman depan website." actions={<AddButton href="/dashboard/featured-services/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan nama" }} />

      {isLoading && <LoadingState />}

      {!isLoading && featuredService.length === 0 && (
        <EmptyState title="Tidak ada layanan unggulan yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && featuredService.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {featuredService.map((service) => (
            <div
              key={service.id}
              className="resource-card"
            >
              <div className="w-full h-48 relative">
                <Image
                  src={`${BASE_URL}/storage/${service.photo}`}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="resource-card-body">
                <h2 className="resource-card-title">
                  {service.name}
                </h2>
                <CardActions editHref={`/dashboard/featured-services/edit/${service.slug}/${service.id}`} onDelete={() => handleDelete(service.id)} disabled={isDeleting} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && featuredService.length > 0 && (
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
