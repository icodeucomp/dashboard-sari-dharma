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
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Sertifikasi & Penghargaan
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
            placeholder="Masukkan judul sertifikasi"
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
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

        <div className="mb-6 flex items-center">
          <label
            htmlFor="file"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload File Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="file"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
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

        <div className="mb-6 flex items-center">
          <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
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

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={`border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Update"}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Gagal memuat data.</div>
      </div>
    );
  }

  return <EditCertificationAwardForm key={String(record.id)} record={record} />;
}
