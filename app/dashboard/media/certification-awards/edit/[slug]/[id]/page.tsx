"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecord } from "@/app/hooks/useRecord";
import { useRouter, useParams } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Image from "next/image";
import {
  getCertificationAwardById,
  updateCertificationAward,
} from "@/app/services/certificationAwardService";
import { PageHeader } from "@/app/components/ui";

type RecordType = Awaited<ReturnType<typeof getCertificationAwardById>>["data"];

function EditCertificationAwardForm({ record }: { record: RecordType }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateCertificationAward(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certification-awards"] });
      router.push("/dashboard/media/certification-awards");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate sertifikasi & penghargaan"),
  });
  const loading = saveMutation.isPending;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const [title, setTitle] = useState(record.title ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState(record.pdf_file || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    if (!title) {
      setError("Judul wajib diisi.");
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

      if (file) {
        formData.append("pdf_file", file);
      }

      if (photo) {
        formData.append("photo", photo);
      }

    saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setTitle(record.title ?? "");
    setCurrentFile(record.pdf_file || "");
    setCurrentPhoto(record.photo || "");
    setFile(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Edit Sertifikasi & Penghargaan" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/media/certification-awards" />

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
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label className="form-label">
            File Saat Ini
          </label>
          <div className="w-3/4">
            {currentFile ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {currentFile}
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Tidak ada file</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="file"
            className="form-label"
          >
            Upload File Baru
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
              onChange={handleFileChange}
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
          <label className="form-label">
            Foto Saat Ini
          </label>
          <div className="w-3/4">
            {currentPhoto ? (
              <Image
                src={`${BASE_URL}/storage/${currentPhoto}`}
                alt="Foto Sertifikasi"
                width={300}
                height={200}
                className="w-32 h-32 object-cover border rounded-md"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Tidak ada foto</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="photo"
            className="form-label"
          >
            Upload Foto Baru
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
              onChange={(e) =>
                setPhoto(e.target.files ? e.target.files[0] : null)
              }
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditCertificationAward() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("certification-awards", id, (recordId) => getCertificationAwardById(
        slug,
        recordId
      ));

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

  return <EditCertificationAwardForm key={String(record.id)} record={record} />;
}
