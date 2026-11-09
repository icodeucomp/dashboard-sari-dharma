"use client";

import { useState } from "react";
import { useDoctorOptions } from "@/app/hooks/useOptions";
import IconPicker from "@/app/components/IconPicker";
import { mdiDelete, mdiPlus, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecialistService } from "@/app/services/specialistService";
import { PageHeader } from "@/app/components/ui";

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
    <div className="page">
      <PageHeader title="Tambah Layanan Spesialis" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/specialist-services" />

      <form
        onSubmit={handleSubmit}
        className="form-card"
      >
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <div className="form-row">
          <label className="form-label">
            Pilih Ikon
          </label>
          <div className="flex-1">
            <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama layanan"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row-top">
          <label
            htmlFor="description"
            className="form-label md:pt-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows={5}
            placeholder="Masukkan deskripsi layanan"
            disabled={loading}
          ></textarea>
        </div>

        {relatedDoctors.map((doctorId, index) => (
          <div key={index} className="form-row">
            <label
              className="form-label"
            >
              Dokter Spesialis Terkait {index + 1} <span className="text-red-500">*</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              {loadingDoctor ? (
                <div className="form-input">
                  Memuat data dokter...
                </div>
              ) : (
                <select
                  value={doctorId}
                  onChange={(e) => handleDoctorChange(index, e.target.value)}
                  className="form-input"
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
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <Icon path={mdiDelete} size={0.8} />
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={handleResetDoctor}
            className="btn btn-outline"
            disabled={loading}
          >
            <Icon path={mdiRestore} size={0.8} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddDoctor}
            className="btn btn-primary"
            disabled={loading}
          >
            <Icon path={mdiPlus} size={0.8} />
            Tambah Dokter
          </button>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className="btn btn-outline"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
