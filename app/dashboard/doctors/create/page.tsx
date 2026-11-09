"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMasterDoctor } from "@/app/services/masterDoctorService";
import { PageHeader } from "@/app/components/ui";

export default function CreateMasterDoctor() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createMasterDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      router.push("/dashboard/doctors");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan data dokter"),
  });
  const loading = saveMutation.isPending;

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleResetForm = () => {
    setName("");
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
      <PageHeader title="Tambah Dokter Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/doctors" />

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

        <div className="form-row">
          <label
            className="form-label"
          >
            Upload Foto
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
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}