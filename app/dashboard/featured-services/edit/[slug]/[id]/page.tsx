"use client";

import { useState } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import {
  getFeaturedServiceById,
  updateFeaturedService,
} from "@/app/services/featuredService";
import Image from "next/image";

const Editor = dynamic(() => import("@/app/components/WysiwygEditor"), {
  ssr: false,
});

type RecordType = Awaited<ReturnType<typeof getFeaturedServiceById>>["data"];

function EditFeaturedServiceForm({ record }: { record: RecordType }) {
  const [name, setName] = useState(record.name ?? "");
  const [description, setDescription] = useState(record.description ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo ?? "");
  const [error, setError] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateFeaturedService(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-services"] });
      router.push("/dashboard/featured-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate layanan"),
  });
  const loading = saveMutation.isPending;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file tidak boleh lebih dari 2MB");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file harus JPG, JPEG, atau PNG");
        return;
      }
      setPhoto(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError("Nama layanan wajib diisi.");
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setName(record.name ?? "");
    setDescription(record.description ?? "");
    setCurrentPhoto(record.photo ?? "");
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Layanan Unggulan
        </h1>
        <div className="py-2 px-4 opacity-0">-</div>
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
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Foto Saat Ini
            </label>
            <div className="w-64 h-48 relative mb-2">
              <Image
                src={
                  currentPhoto.startsWith("http")
                    ? currentPhoto
                    : `${BASE_URL}/storage/${currentPhoto}`
                }
                alt="Foto saat ini"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Ganti Foto
          </label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="photo"
              className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer"
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {photo ? photo.name : "max. 2MB (JPG, JPEG, PNG)"}
            </span>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama layanan"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >
            Deskripsi
          </label>
          <Editor
            value={description}
            onChange={(value: string) => setDescription(value)}
            placeholder="Masukkan deskripsi layanan"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
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

export default function EditFeaturedService() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("featured-services", id, (recordId) => getFeaturedServiceById(slug, recordId));

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

  return <EditFeaturedServiceForm key={String(record.id)} record={record} />;
}
