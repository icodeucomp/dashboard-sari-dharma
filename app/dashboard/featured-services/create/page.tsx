"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeaturedService } from "@/app/services/featuredService";
import { PageHeader } from "@/app/components/ui";

const Editor = dynamic(() => import("@/app/components/WysiwygEditor"), { ssr: false });

export default function CreateFeaturedService() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createFeaturedService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured-services"] });
      router.push("/dashboard/featured-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan layanan"),
  });
  const loading = saveMutation.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file tidak boleh lebih dari 2MB");
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
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
    setName("");
    setDescription("");
    setPhoto(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Layanan Unggulan" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/featured-services" />

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
              className="btn btn-outline"
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
            <span className="form-hint">
              {photo ? photo.name : "max. 2MB (JPG, JPEG, PNG)"}
            </span>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama layanan"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="form-label-block"
          >
            Deskripsi
          </label>
          <Editor
            value={description}
            onChange={(value: string) => setDescription(value)}
            placeholder="Masukkan deskripsi layanan"
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
