"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { createCareer } from "@/app/services/careerService";
import { PageHeader } from "@/app/components/ui";

export default function AddCareer() {
  const [division, setDivision] = useState("");
  const [position, setPosition] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      router.push("/dashboard/media/careers");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan karir"),
  });
  const loading = saveMutation.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!division) {
      setError("Divisi wajib diisi.");
      return false;
    }

    if (!position) {
      setError("Posisi wajib diisi.");
      return false;
    }

    if (!applicationLink) {
      setError("Link pendaftaran wajib diisi.");
      return false;
    }

    try {
      new URL(applicationLink);
    } catch {
      setError("Link pendaftaran harus berupa URL yang valid.");
      return false;
    }

    if (!photo) {
      setError("Foto wajib diupload.");
      return false;
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      setError("Ukuran file tidak boleh lebih dari 5MB.");
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
      formData.append("division", division);
      formData.append("position", position);
      formData.append("application_link", applicationLink);

      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setDivision("");
    setPosition("");
    setApplicationLink("");
    setPhoto(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Karir Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/careers" />

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
            htmlFor="photo"
            className="form-label"
          >
            Upload Foto <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 md:flex-1">
            <label
              htmlFor="photo"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} />
              Browse
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            {photo && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {photo.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 5mb</span>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="division"
            className="form-label"
          >
            Divisi <span className="text-red-500">*</span>
          </label>
          <input
            id="division"
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="form-input"
            placeholder="Masukkan divisi"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="position"
            className="form-label"
          >
            Posisi <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="form-input"
            placeholder="Masukkan posisi"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="applicationLink"
            className="form-label"
          >
            Link Pendaftaran <span className="text-red-500">*</span>
          </label>
          <input
            id="applicationLink"
            type="url"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            className="form-input"
            placeholder="Masukkan link pendaftaran (contoh: https://example.com)"
            disabled={loading}
          />
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
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
