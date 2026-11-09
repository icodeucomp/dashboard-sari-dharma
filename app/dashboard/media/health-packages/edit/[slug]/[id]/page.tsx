"use client";

import { useState } from "react";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import {
  getHealthPackageById,
  updateHealthPackage,
} from "@/app/services/healthPackageService";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect } from "@/app/components/CreatableSelect";
import { PageHeader } from "@/app/components/ui";

type RecordType = Awaited<ReturnType<typeof getHealthPackageById>>["data"];

function EditHealthPackageForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateHealthPackage(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-packages"] });
      router.push("/dashboard/media/health-packages");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate paket kesehatan"),
  });
  const loading = saveMutation.isPending;

  const [categoryId, setCategoryId] = useState(record.category_id ?? "");
  const [promo, setPromo] = useState(record.promo ?? 0);
  const [validUntil, setValidUntil] = useState(record.valid_until ? record.valid_until.split('T')[0] : "");
  const [name, setName] = useState(record.name ?? "");
  const [description, setDescription] = useState(record.description || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("HealthPackage");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(name, "HealthPackage"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => setError("Gagal membuat kategori baru"),
  });

  const handleCreateCategory = async (name: string) => {
    try {
      const response = await createCategoryMutation.mutateAsync(name);
      return { success: true, newOption: { label: response.data.name, value: response.data.id } };
    } catch {
      return { success: false };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleResetForm = () => {
    setName(record.name ?? "");
    setCategoryId(record.category_id ?? "");
    setPromo(record.promo ?? 0);
    setValidUntil(record.valid_until ? record.valid_until.split('T')[0] : "");
    setDescription(record.description || "");
    setCurrentPhoto(record.photo || "");
    setPhoto(null);
    setError("");
  };

  const validateForm = () => {
    if (!name) {
      setError("Nama paket wajib diisi.");
      return false;
    }

    if (!categoryId) {
      setError("Kategori harus dipilih");
      return false;
    }

    if (promo && !validUntil) {
      setError("Tanggal berlaku sampai wajib diisi untuk promo.");
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
      formData.append("category_id", categoryId);
      formData.append("promo", promo ? "1" : "0");

      if (validUntil) {
        formData.append("valid_until", validUntil);
      }

      if (description) {
        formData.append("description", description);
      }

      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  return (
    <div className="page">
      <PageHeader title="Edit Paket Kesehatan" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/media/health-packages" />

      <form
        onSubmit={handleSubmit}
        className="form-card"
      >
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

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
                    alt="Foto Paket Kesehatan"
                    width={300}
                    height={200}
                    className="h-48 object-cover border"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada foto</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className="form-label">
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
                {photo ? photo.name : "max. 5mb"}
              </span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="category"
            className="form-label"
          >
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <CategorySelect
              value={categoryId}
              options={categoryOptions}
              onChange={setCategoryId}
              onCreateOption={handleCreateCategory}
              isLoading={loadingCategory}
              isDisabled={loading}
              placeholder="Pilih atau ketik untuk membuat kategori baru"
              className="w-full"
            />
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">
            Promo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="yes"
                checked={promo === 1}
                onChange={() => setPromo(1)}
                className="mr-2"
                disabled={loading}
              />
              Ya
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="no"
                checked={promo === 0}
                onChange={() => setPromo(0)}
                className="mr-2"
                disabled={loading}
              />
              Tidak
            </label>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="validUntil"
            className="form-label"
          >
            Berlaku Sampai
          </label>
          <input
            id="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Paket <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama paket"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row-top">
          <label
            htmlFor="description"
            className="form-label md:pt-2"
          >
            Deskripsi
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows={5}
            placeholder="Masukkan deskripsi paket"
            disabled={loading}
          ></textarea>
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

export default function EditHealthPackage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("health-packages", id, (recordId) => getHealthPackageById(slug, recordId));

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

  return <EditHealthPackageForm key={String(record.id)} record={record} />;
}
