"use client";

import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { getMasterDoctor, deleteMasterDoctor, DoctorItem } from "@/app/services/masterDoctorService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, RowActions } from "@/app/components/ui";

export default function MasterDoctor() {
  const {
    items: doctorList,
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
  } = usePaginatedList<DoctorItem>({ key: "doctors", fetchList: getMasterDoctor, remove: deleteMasterDoctor });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokter ini?")) deleteItem(id);
  };

  return (
    <div className="page">
      <PageHeader title="Master Dokter" description="Data dokter. Foto yang diunggah di sini juga tampil di halaman Jadwal Dokter." actions={<AddButton href="/dashboard/doctors/create" label="Tambah Dokter" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari dokter" }} />

      {isLoading && <LoadingState />}

      {!isLoading && (!doctorList || doctorList.length === 0) && (
        <EmptyState title="Tidak ada data dokter yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && doctorList.length > 0 && (
        <div className="table-card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Foto
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Nama Dokter
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {doctorList.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={doctor.photo ? `${BASE_URL}/storage/${doctor.photo}` : "/user.svg"}
                          alt={doctor.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {doctor.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <RowActions editHref={`/dashboard/doctors/edit/${doctor.id}`} onDelete={() => handleDelete(doctor.id)} disabled={isDeleting} />
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