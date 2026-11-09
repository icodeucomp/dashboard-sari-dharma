"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { createCertificationAward } from "@/app/services/certificationAwardService";
import { PageHeader } from "@/app/components/ui";

export default function AddCertificationAward() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createCertificationAward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certification-awards"] });
      router.push("/dashboard/media/certification-awards");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan sertifikasi & penghargaan"),
  });
  const loading = saveMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      setError("Semua field wajib diisi.");
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("pdf_file", file);
      if (photo) {
        formData.append("photo", photo);
      }

    saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setTitle("");
    setFile(null);
    setPhoto(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Sertifikasi & Penghargaan" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/certification-awards" />

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
            placeholder="Masukkan judul sertifikasi"
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="file"
            className="form-label"
          >
            Upload PDF <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap items-center gap-4 md:flex-1">
            <label
              htmlFor="file"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} />
              Browse
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              disabled={loading}
            />
            {file && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {file.name}
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
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
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
