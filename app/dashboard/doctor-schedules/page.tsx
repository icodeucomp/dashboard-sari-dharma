"use client";

import { useState } from "react";
import Image from "next/image";

import Pagination from "@/app/components/Pagination";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useDoctorOptions, useSpecialistOptions } from "@/app/hooks/useOptions";
import Modal from "@/app/components/Modal";
import { getDoctorSchedule, deleteDoctorSchedule, DoctorScheduleItem } from "@/app/services/doctorScheduleService";
import { PageHeader, AddButton, ListToolbar, EmptyState, LoadingState, CardActions } from "@/app/components/ui";

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
    <div className="page">
      <PageHeader title="Jadwal Dokter" description="Jadwal praktik dokter per spesialis. Dokter dipilih dari Master Dokter." actions={<AddButton href="/dashboard/doctor-schedules/create" label="Tambah Baru" />} />

      <ListToolbar search={{ value: searchInput, onChange: setSearchInput, onSubmit: submitSearch, placeholder: "Cari berdasarkan nama dokter" }} onFilter={openFilterModal} />

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
              className="form-input"
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
              className="form-input"
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

      {!isLoading && (!doctorSchedule || doctorSchedule.length === 0) && (
        <EmptyState title="Tidak ada jadwal dokter yang ditemukan" description="Data akan muncul di sini setelah ditambahkan." />
      )}

      {!isLoading && doctorSchedule.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
          {doctorSchedule.map((doctor) => (
            <div
              key={doctor.id}
              className="resource-card"
            >
              <div className="h-48 overflow-hidden">
                {doctor.doctor?.photo ? (
                  <Image
                    src={`${BASE_URL}/storage/${doctor.doctor.photo}`}
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
                <h2 className="resource-card-title">
                  {doctor.doctor?.name || "Nama Dokter Tidak Tersedia"}
                </h2>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                  {doctor.specialist?.name || "Spesialis Tidak Tersedia"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {doctor.doctor_background}
                </p>
                <div className="flex-1"></div>
                <CardActions editHref={`/dashboard/doctor-schedules/edit/${doctor.id}`} onDelete={() => handleDelete(doctor.id)} disabled={isDeleting} />
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
