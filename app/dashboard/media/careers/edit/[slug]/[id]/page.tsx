"use client";

import { useState } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { getCareerById, updateCareer } from "@/app/services/careerService";

type RecordType = Awaited<ReturnType<typeof getCareerById>>["data"];

function EditCareerForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateCareer(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      router.push("/dashboard/media/careers");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate karir"),
  });
  const loading = saveMutation.isPending;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const [division, setDivision] = useState(record.division ?? "");
  const [position, setPosition] = useState(record.position ?? "");
  const [applicationLink, setApplicationLink] = useState(record.application_link ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

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

  const handleResetForm = () => {
    setDivision(record.division ?? "");
    setPosition(record.position ?? "");
    setApplicationLink(record.application_link ?? "");
    setCurrentPhoto(record.photo || "");
    setPhoto(null);
    setError("");
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Karir
        </h1>
        <Link
          href="/dashboard/media/careers"
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

        {currentPhoto && (
          <div className="mb-6 flex items-center">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Foto Saat Ini
            </label>
            <div className="w-3/4">
              <div className="relative h-48 w-full max-w-xs">
                <Image
                  src={`${BASE_URL}/storage/${currentPhoto}`}
                  alt="Foto Karir"
                  width={300}
                  height={200}
                  className="h-48 object-cover border"
                />
              </div>
            </div>
          </div>
        )}

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

        <div className="mb-6 flex items-center">
          <label
            htmlFor="division"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Divisi <span className="text-red-500">*</span>
          </label>
          <input
            id="division"
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan divisi"
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="position"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Posisi <span className="text-red-500">*</span>
          </label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan posisi"
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="applicationLink"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Link Pendaftaran <span className="text-red-500">*</span>
          </label>
          <input
            id="applicationLink"
            type="url"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan link pendaftaran (contoh: https://example.com)"
            disabled={loading}
          />
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

export default function EditCareer() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("careers", id, (recordId) => getCareerById(slug, recordId));

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

  return <EditCareerForm key={String(record.id)} record={record} />;
}
