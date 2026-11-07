"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getFacilityService, deleteFacilityService, FacilityServiceItem } from "@/app/services/facilityService";

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
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Layanan & Fasilitas
          </h1>
          <form
            onSubmit={submitSearch}
            className="flex items-center flex-1 max-w-md"
          >
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
          href="/dashboard/facility-services/create"
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

      {!isLoading && (!facilityService || facilityService.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada layanan & fasilitas yang ditemukan.
          </p>
        </div>
      )}

      {!isLoading && facilityService.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
          {facilityService.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <Image
                  src={`${BASE_URL}/storage/${service.header_photo}`}
                  alt={service.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {service.name}
                </h2>
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/facility-services/edit/${service.slug}/${service.id}`}
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
