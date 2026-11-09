"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiRestore } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { useRecord } from "@/app/hooks/useRecord";
import { useDoctorOptions } from "@/app/hooks/useOptions";
import { getSpecialistServiceById, updateSpecialistService } from "@/app/services/specialistService";
import { PageHeader } from "@/app/components/ui";

const Editor = dynamic(() => import("@/app/components/WysiwygEditor"), { ssr: false });
const IconPicker = dynamic(() => import("@/app/components/IconPicker"), { ssr: false });

type RecordType = Awaited<ReturnType<typeof getSpecialistServiceById>>["data"];

function EditSpecialistServiceForm({ record }: { record: RecordType }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();

  const initialDoctorIds = record.doctors.length > 0 ? record.doctors.map((doctor) => doctor.id) : [""];

  const [name, setName] = useState(record.name);
  const [description, setDescription] = useState(record.description);
  const [selectedIcon, setSelectedIcon] = useState(record.icon);
  const [relatedDoctors, setRelatedDoctors] = useState<string[]>(initialDoctorIds);
  const [error, setError] = useState("");

  const saveMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateSpecialistService>[1]) => updateSpecialistService(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialist-services"] });
      router.push("/dashboard/specialist-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate layanan spesialis"),
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

  const handleReset = () => {
    setName(record.name);
    setDescription(record.description);
    setSelectedIcon(record.icon);
    setRelatedDoctors(initialDoctorIds);
  };

  return (
    <div className="page">
      <PageHeader title="Edit Layanan Spesialis" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/specialist-services" />

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

        <div className="mb-6">
          <label
            htmlFor="description"
            className="form-label-block"
          >
            Deskripsi
          </label>
          <Editor
            value={description}
            onChange={(value: string) => setDescription(value)}
            placeholder="Masukkan deskripsi layanan"
          />
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
            onClick={handleReset}
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditSpecialistService() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("specialist-services", id, (recordId) => getSpecialistServiceById(slug, recordId));

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="p-6">
        <div className="alert-error">Gagal memuat data.</div>
      </div>
    );
  }

  return <EditSpecialistServiceForm key={String(record.id)} record={record} />;
}
