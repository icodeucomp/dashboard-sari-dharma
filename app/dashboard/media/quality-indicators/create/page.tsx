"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { createQualityIndicator } from "@/app/services/qualityIndicatorService";
import { PageHeader } from "@/app/components/ui";

export default function AddQualityIndicator() {
  const [title, setTitle] = useState("");
  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createQualityIndicator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-indicators"] });
      router.push("/dashboard/media/quality-indicators");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan indikator mutu"),
  });
  const loading = saveMutation.isPending;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilePdf(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!title) {
      setError("Judul wajib diisi.");
      return false;
    }

    if (!filePdf) {
      setError("File PDF wajib diupload.");
      return false;
    }

    if (filePdf && filePdf.size > 5 * 1024 * 1024) {
      setError("Ukuran file PDF tidak boleh lebih dari 5MB.");
      return false;
    }

    if (photo && photo.size > 2 * 1024 * 1024) {
      setError("Ukuran file foto tidak boleh lebih dari 2MB.");
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
      formData.append("title", title);

      if (filePdf) {
        formData.append("pdf_file", filePdf);
      }

      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setTitle("");
    setFilePdf(null);
    setPhoto(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Indikator Mutu Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/quality-indicators" />

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
            htmlFor="title"
            className="form-label"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Masukkan judul indikator mutu"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="pdf_file"
            className="form-label"
          >
            Upload PDF <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 md:flex-1">
            <label
              htmlFor="pdf_file"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} />
              Browse
            </label>
            <input
              id="pdf_file"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfChange}
              disabled={loading}
            />
            {filePdf && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filePdf.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 5mb</span>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="photo"
            className="form-label"
          >
            Upload Foto
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
              onChange={handlePhotoChange}
              disabled={loading}
            />
            {photo && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {photo.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 2mb</span>
          </div>
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
