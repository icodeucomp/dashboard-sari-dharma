"use client";

import { useState } from "react";
import { useDoctorOptions } from "@/app/hooks/useOptions";
import IconPicker from "@/app/components/IconPicker";
import { mdiDelete, mdiPlus, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecialistService } from "@/app/services/specialistService";

export default function CreateSpecialistService() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [relatedDoctors, setRelatedDoctors] = useState<string[]>([""]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [error, setError] = useState("");
  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createSpecialistService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-services"] });
      router.push("/dashboard/specialist-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan layanan"),
  });
  const loading = saveMutation.isPending;

  const handleAddDoctor = () => {
    setRelatedDoctors([...relatedDoctors, ""]);
  };

  const handleDeleteDoctor = (index: number) => {
    const updatedDoctor = relatedDoctors.filter((_, i) => i !== index);
    setRelatedDoctors(updatedDoctor);
  };

  const handleResetDoctor = () => {
    setRelatedDoctors([""]);
  };

  const handleDoctorChange = (index: number, doctorId: string) => {
    const updatedDoctor = [...relatedDoctors];
    updatedDoctor[index] = doctorId;
    setRelatedDoctors(updatedDoctor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedIcon) {
      setError("Nama layanan dan ikon wajib diisi.");
      return;
    }

    const validDoctorIds = relatedDoctors.filter(id => id !== "");
    if (relatedDoctors.length > 0 && validDoctorIds.length !== relatedDoctors.length) {
      setError("Semua dokter terkait harus dipilih.");
      return;
    }

    setError("");

      const payload = {
        name: name,
        description: description,
        icon: selectedIcon,
        doctor_ids: validDoctorIds,
      };

      saveMutation.mutate(payload);
  };

  const handleResetForm = () => {
    setName("");
    setDescription("");
    setRelatedDoctors([""]);
    setSelectedIcon("");
    setError("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Layanan Spesialis
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Pilih Ikon
          </label>
          <div className="flex-1">
            <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama layanan"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={5}
            placeholder="Masukkan deskripsi layanan"
            disabled={loading}
          ></textarea>
        </div>

        {relatedDoctors.map((doctorId, index) => (
          <div key={index} className="mb-6 flex items-center">
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
            >
              Dokter Spesialis Terkait {index + 1} <span className="text-red-500">*</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              {loadingDoctor ? (
                <div className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700">
                  Memuat data dokter...
                </div>
              ) : (
                <select
                  value={doctorId}
                  onChange={(e) => handleDoctorChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>
                    Pilih Dokter
                  </option>
                  {doctorOptions.map((doctor) => (
                    <option key={doctor.value} value={doctor.value}>
                      {doctor.label}
                    </option>
                  ))}
                </select>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDoctor(index)}
                  className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  <Icon path={mdiDelete} size={0.8} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={handleResetDoctor}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Icon path={mdiRestore} size={0.8} className="mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddDoctor}
            className={`flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add More
          </button>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
