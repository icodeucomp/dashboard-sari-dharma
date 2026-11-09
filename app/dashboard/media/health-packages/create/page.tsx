"use client";

import { useState } from "react";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHealthPackage } from "@/app/services/healthPackageService";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect } from "@/app/components/CreatableSelect";
import { PageHeader } from "@/app/components/ui";

export default function AddHealthPackage() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createHealthPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-packages"] });
      router.push("/dashboard/media/health-packages");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan paket kesehatan"),
  });
  const loading = saveMutation.isPending;

  const [categoryId, setCategoryId] = useState("");
  const [promo, setPromo] = useState(false);
  const [validUntil, setValidUntil] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("HealthPackage");

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
    setCategoryId("");
    setPromo(false);
    setValidUntil("");
    setName("");
    setDescription("");
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
      <PageHeader title="Tambah Paket Kesehatan" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/health-packages" />

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
          <label className="form-label">
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
              {photo ? photo.name : "max. 5mb"}
            </span>
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
                checked={promo === true}
                onChange={() => setPromo(true)}
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
                checked={promo === false}
                onChange={() => setPromo(false)}
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
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
