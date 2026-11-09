"use client";

import { useState } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import {
  getMasterDoctorById,
  updateMasterDoctor,
} from "@/app/services/masterDoctorService";
import { PageHeader } from "@/app/components/ui";

type RecordType = Awaited<ReturnType<typeof getMasterDoctorById>>["data"];

function EditMasterDoctorForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateMasterDoctor(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push("/dashboard/doctors");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat memperbarui data dokter"),
  });
  const loading = saveMutation.isPending;

  const [name, setName] = useState(record.name ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleResetForm = () => {
    setName(record.name ?? "");
    setCurrentPhoto(record.photo || "");
    setPhoto(null);
    setError("");
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError("Nama dokter tidak boleh kosong");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("name", name);

      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  return (
    <div className="page">
      <PageHeader title="Edit Dokter" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/doctors" />

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
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Dokter <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama dokter"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label className="form-label">
              Foto Saat Ini
            </label>
            <div className="flex-1">
              {currentPhoto ? (
                <div className="relative h-48 w-full max-w-xs">
                  <Image
                    src={`${BASE_URL}/storage/${currentPhoto}`}
                    alt="Foto Dokter"
                    width={200}
                    height={200}
                    className="h-48 object-cover border"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada foto</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-row">
          <label
            className="form-label"
          >
            Upload Foto Baru
          </label>
          <div className="flex flex-wrap items-center gap-3 md:flex-1">
            <label
              htmlFor="photo"
              className={`btn btn-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <span className="form-hint">
              {photo ? photo.name : "max. 2mb. Foto ini tampil di halaman Jadwal Dokter."}
            </span>
          </div>
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditMasterDoctor() {
  const { id } = useParams<{ id: string }>();
  const { data: record, isLoading, isError } = useRecord("doctors", id, (recordId) => getMasterDoctorById(recordId));

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

  return <EditMasterDoctorForm key={String(record.id)} record={record} />;
}
