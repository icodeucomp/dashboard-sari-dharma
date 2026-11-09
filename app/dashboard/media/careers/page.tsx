"use client";

import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getCareer, deleteCareer, CareerItem } from "@/app/services/careerService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

export default function Career() {
  const {
    items: career,
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
  } = usePaginatedList<CareerItem>({ key: "careers", fetchList: getCareer, remove: deleteCareer });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus karir ini?")) deleteItem(id);
  };

  return (
    <div className="page">
      <PageHeader title="Karir" description="Lowongan kerja yang tampil di website." actions={<AddButton href="/dashboard/media/careers/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan divisi atau posisi" }} />

      {isLoading && <LoadingState />}

      {!isLoading && (!career || career.length === 0) && (
        <EmptyState title="Tidak ada karir yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && career.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {career.map((item) => (
            <div
              key={item.id} className="resource-card">
              <div className="relative">
                <Image
                  src={`${BASE_URL}/storage/${item.photo}`}
                  alt={item.position}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {item.division && (
                  <div className="absolute bottom-0 left-0 bg-[#FB973B] text-white text-xs font-medium px-2 py-1">
                    {item.division}
                  </div>
                )}
              </div>

              <div className="resource-card-body">
                <h2 className="resource-card-title">
                  {item.position}
                </h2>
                <CardActions editHref={`/dashboard/media/careers/edit/${item.slug}/${item.id}`} onDelete={() => handleDelete(item.id)} disabled={isDeleting} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && career.length > 0 && (
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
