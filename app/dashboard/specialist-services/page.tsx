"use client";

import Icon from "@mdi/react";
import { mdiStethoscope } from "@mdi/js";
import * as MDIIcons from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getSpecialistService, deleteSpecialistService, SpecialistServiceItem } from "@/app/services/specialistService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

const getIconPath = (iconName: string) => {
  return (MDIIcons as {[key: string]: string})[iconName] || mdiStethoscope;
};

export default function SpecialistService() {
  const {
    items: specialistService,
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
  } = usePaginatedList<SpecialistServiceItem>({ key: "specialist-services", fetchList: getSpecialistService, remove: deleteSpecialistService });

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) deleteItem(id);
  };

  return (
    <div className="page">
      <PageHeader title="Layanan Spesialis" description="Layanan spesialis klinik beserta dokter yang menanganinya." actions={<AddButton href="/dashboard/specialist-services/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan nama" }} />

      {isLoading && <LoadingState />}

      {!isLoading && (!specialistService || specialistService.length === 0) && (
        <EmptyState title="Tidak ada layanan spesialis yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && specialistService.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {specialistService.map((service) => (
            <div
              key={service.id} className="resource-card">
              <div className="flex justify-center items-center py-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Icon path={getIconPath(service.icon)} size={1.5} className="text-orange-600" />
                </div>
              </div>

              <div className="resource-card-body">
                <h2 className="resource-card-title">
                  {service.name}
                </h2>
                {service.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {service.description.replace(/<[^>]*>/g, '').substring(0, 100)}
                  {service.description.length > 100 ? '...' : ''}
                  </p>
                )}

                {service.doctors && service.doctors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dokter Terkait:
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc pl-4">
                      {service.doctors.map((doctor) => (
                        <li key={doctor.id} className="mb-1">{doctor.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <CardActions editHref={`/dashboard/specialist-services/edit/${service.slug}/${service.id}`} onDelete={() => handleDelete(service.id)} disabled={isDeleting} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && specialistService.length > 0 && (
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
