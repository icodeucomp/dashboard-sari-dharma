"use client";

import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify, mdiStethoscope } from "@mdi/js";
import * as MDIIcons from "@mdi/js";
import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getSpecialistService, deleteSpecialistService, SpecialistServiceItem } from "@/app/services/specialistService";

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
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Layanan Spesialis
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
        <Link
          href="/dashboard/specialist-services/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Baru
        </Link>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {!isLoading && (!specialistService || specialistService.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Tidak ada layanan spesialis yang ditemukan.</p>
        </div>
      )}

      {!isLoading && specialistService.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {specialistService.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex justify-center items-center py-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Icon path={getIconPath(service.icon)} size={1.5} className="text-orange-600" />
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
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

                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/specialist-services/edit/${service.slug}/${service.id}`}
                    className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>

                  <button
                    onClick={() => handleDelete(service.id)}
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
