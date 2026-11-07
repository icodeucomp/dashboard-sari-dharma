"use client";

import { useState } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload, mdiFilePdfBox } from "@mdi/js";
import { getQualityIndicatorById, updateQualityIndicator } from "@/app/services/qualityIndicatorService";

type RecordType = Awaited<ReturnType<typeof getQualityIndicatorById>>["data"];

function EditQualityIndicatorForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateQualityIndicator(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quality-indicators"] });
      router.push("/dashboard/media/quality-indicators");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate indikator mutu"),
  });
  const loading = saveMutation.isPending;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const [title, setTitle] = useState(record.title ?? "");
  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState(record.pdf_file || "");
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

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

  const handleResetForm = () => {
    setTitle(record.title ?? "");
    setCurrentFile(record.pdf_file || "");
    setCurrentPhoto(record.photo || "");
    setFilePdf(null);
    setPhoto(null);
    setError("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Indikator Mutu
        </h1>
        <Link
          href="/dashboard/media/quality-indicators"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
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

        {currentFile && (
          <div className="mb-6 flex items-center">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              PDF Saat Ini
            </label>
            <div className="w-3/4 flex items-center gap-4">
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Icon path={mdiFilePdfBox} size={1.5} className="text-red-600 dark:text-red-400 mr-2" />
                <a
                  href={`${BASE_URL}/storage/${currentFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lihat File PDF
                </a>
              </div>
            </div>
          </div>
        )}

        {currentPhoto && (
          <div className="mb-6 flex items-center">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Foto Saat Ini
            </label>
            <div className="w-3/4">
              <div className="relative h-48 w-full max-w-xs">
                <Image
                  src={`${BASE_URL}/storage/${currentPhoto}`}
                  alt="Foto Indikator Mutu"
                  width={300}
                  height={200}
                  className="h-48 object-cover border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center">
          <label
            htmlFor="title"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul indikator mutu"
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="pdf_file"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload PDF Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="pdf_file"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
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

        <div className="mb-6 flex items-center">
          <label
            htmlFor="photo"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Foto Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="photo"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
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
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditQualityIndicator() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("quality-indicators", id, (recordId) => getQualityIndicatorById(slug, recordId));

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Gagal memuat data.</div>
      </div>
    );
  }

  return <EditQualityIndicatorForm key={String(record.id)} record={record} />;
}
