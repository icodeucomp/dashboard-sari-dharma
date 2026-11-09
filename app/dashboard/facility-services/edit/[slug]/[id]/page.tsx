"use client";

import { useState } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { getFacilityServiceById, updateFacilityService } from "@/app/services/facilityService";
import { PageHeader } from "@/app/components/ui";

type RecordType = Awaited<ReturnType<typeof getFacilityServiceById>>["data"];

function EditFacilityServiceForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateFacilityService(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-services"] });
      router.push("/dashboard/facility-services");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate layanan & fasilitas"),
  });
  const loading = saveMutation.isPending;

  const [name, setName] = useState(record.name ?? "");
  const [description, setDescription] = useState(record.overview_description ?? "");
  const [facilityService, setFacilityService] = useState(record.services ?? "");
  const [headerPhoto, setHeaderPhoto] = useState<File | null>(null);
  const [otherPhoto, setOtherPhoto] = useState<File | null>(null);
  const [currentHeaderPhoto, setCurrentHeaderPhoto] = useState(record.header_photo ?? "");
  const [currentOtherPhoto, setCurrentOtherPhoto] = useState(record.other_photo ?? "");
  const [error, setError] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

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
    setName(record.name ?? "");
    setDescription(record.overview_description ?? "");
    setFacilityService(record.services ?? "");
    setCurrentHeaderPhoto(record.header_photo ?? "");
    setCurrentOtherPhoto(record.other_photo ?? "");
    setHeaderPhoto(null);
    setOtherPhoto(null);
  };

  return (
    <div className="page">
      <PageHeader title="Edit Layanan & Fasilitas" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/facility-services" />

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
          <div className="flex items-center">
            <label className="form-label">
              Foto Header Saat Ini (300px x 200px)
            </label>
            <div className="flex-1">
              {currentHeaderPhoto ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={`${BASE_URL}/storage/${currentHeaderPhoto}`}
                    alt="Foto Header"
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

          <div className="flex items-center mt-4">
            <label className="form-label">
              Upload Foto Header Baru
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

        <div className="mb-6">
          <div className="flex items-center">
            <label className="form-label">
              Foto Lainnya Saat Ini
            </label>
            <div className="flex-1">
              {currentOtherPhoto ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={`${BASE_URL}/storage/${currentOtherPhoto}`}
                    alt="Foto Lainnya"
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

          <div className="flex items-center mt-4">
            <label className="form-label">
              Upload Foto Lainnya Baru
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditFacilityService() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("facility-services", id, (recordId) => getFacilityServiceById(slug, recordId));

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

  return <EditFacilityServiceForm key={String(record.id)} record={record} />;
}
