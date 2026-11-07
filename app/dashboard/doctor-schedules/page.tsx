"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify } from "@mdi/js";
import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useDoctorOptions, useSpecialistOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import { getDoctorSchedule, deleteDoctorSchedule, DoctorScheduleItem } from "@/app/services/doctorScheduleService";

export default function DoctorSchedule() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterDoctorId, setFilterDoctorId] = useState("");
  const [filterSpecialistId, setFilterSpecialistId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();
  const { options: specialistOptions, isLoading: loadingSpecialist } = useSpecialistOptions();

  const {
    items: doctorSchedule,
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
  } = usePaginatedList<DoctorScheduleItem>({
    key: "doctor-schedules",
    fetchList: getDoctorSchedule,
    remove: deleteDoctorSchedule,
    filters: appliedFilters,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const openFilterModal = () => setIsFilterModalOpen(true);

  const applyFilter = () => {
    setAppliedFilters({ doctor_id: filterDoctorId || undefined, specialist_id: filterSpecialistId || undefined });
    setPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilter = () => {
    setFilterDoctorId("");
    setFilterSpecialistId("");
    setAppliedFilters({});
    resetSearch();
    setIsFilterModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal dokter ini?")) deleteItem(id);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Jadwal Dokter
          </h1>
          <form
            onSubmit={submitSearch}
            className="flex items-center flex-1 max-w-md"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari berdasarkan nama dokter"
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
        <div className="flex gap-4">
          <button
            onClick={openFilterModal}
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filter
          </button>
          <Link
            href="/dashboard/doctor-schedules/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Tambah Baru
          </Link>
        </div>
      </div>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Jadwal Dokter"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dokter
            </label>
            <select
              value={filterDoctorId}
              onChange={(e) => setFilterDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingDoctor}
            >
              <option value="">Semua Dokter</option>
              {doctorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Spesialis
            </label>
            <select
              value={filterSpecialistId}
              onChange={(e) => setFilterSpecialistId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loadingSpecialist}
            >
              <option value="">Semua Spesialis</option>
              {specialistOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={resetFilter}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Reset
            </button>
            <button
              onClick={applyFilter}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </Modal>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      )}

      {!isLoading && (!doctorSchedule || doctorSchedule.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Tidak ada jadwal dokter yang ditemukan.
          </p>
        </div>
      )}

      {!isLoading && doctorSchedule.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {doctorSchedule.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                {doctor.photo ? (
                  <Image
                    src={`${BASE_URL}/storage/${doctor.photo}`}
                    alt={doctor.doctor?.name || "Dokter"}
                    width={300}
                    height={200}
                    className="w-full h-48 object-scale-down bg-white"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Foto Tidak Tersedia
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {doctor.doctor?.name || "Nama Dokter Tidak Tersedia"}
                </h2>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                  {doctor.specialist?.name || "Spesialis Tidak Tersedia"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {doctor.doctor_background}
                </p>
                <div className="flex-1"></div>
                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/dashboard/doctor-schedules/edit/${doctor.id}`}
                    className="flex-1 flex items-center justify-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                  >
                    Edit
                    <Icon path={mdiPencil} size={0.8} className="ml-2" />
                  </Link>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium py-2 px-4 rounded-md"
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

      {!isLoading && doctorSchedule.length > 0 && (
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
