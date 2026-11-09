"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFacilityService } from "@/app/services/facilityService";
import { PageHeader } from "@/app/components/ui";

export default function CreateFacilityService() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [facilityService, setFacilityService] = useState("");
  const [headerPhoto, setHeaderPhoto] = useState<File | null>(null);
  const [otherPhoto, setOtherPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createFacilityService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-services"] });
      router.push("/dashboard/facility-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan layanan & fasilitas"),
  });
  const loading = saveMutation.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "header") {
        setHeaderPhoto(e.target.files[0]);
      } else {
        setOtherPhoto(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError("Nama fasilitas wajib diisi.");
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("overview_description", description);
      formData.append("services", facilityService);

      if (headerPhoto) {
        formData.append("header_photo", headerPhoto);
      }

      if (otherPhoto) {
        formData.append("other_photo", otherPhoto);
      }

      saveMutation.mutate(formData);
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setFacilityService("");
    setHeaderPhoto(null);
    setOtherPhoto(null);
    setError("");
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Layanan & Fasilitas" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/facility-services" />

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
            Upload Foto Header
          </label>
          <div className="flex flex-wrap items-center gap-3 md:flex-1">
            <label
              htmlFor="headerPhoto"
              className={`btn btn-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input
              id="headerPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "header")}
              className="hidden"
              disabled={loading}
            />
            <span className="form-hint">
              {headerPhoto ? headerPhoto.name : "max. 2mb"}
            </span>
          </div>
        </div>

        <div className="form-row">
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Fasilitas <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama fasilitas"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label className="form-label">
            Upload Foto Lainnya
          </label>
          <div className="flex flex-wrap items-center gap-3 md:flex-1">
            <label
              htmlFor="otherPhoto"
              className={`btn btn-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input
              id="otherPhoto"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "other")}
              className="hidden"
              disabled={loading}
            />
            <span className="form-hint">
              {otherPhoto ? otherPhoto.name : "max. 2mb"}
            </span>
          </div>
        </div>

        <div className="form-row-top">
          <label
            htmlFor="description"
            className="form-label md:pt-2"
          >
            Deskripsi Overview
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows={5}
            placeholder="Masukkan deskripsi overview"
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-row-top">
          <label
            htmlFor="facilityService"
            className="form-label md:pt-2"
          >
            Layanan Fasilitas
          </label>
          <textarea
            id="facilityService"
            value={facilityService}
            onChange={(e) => setFacilityService(e.target.value)}
            className="form-input"
            rows={8}
            placeholder="Masukkan layanan fasilitas"
            disabled={loading}
          ></textarea>
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
