"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFacilityService } from "@/app/services/facilityService";

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
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Layanan & Fasilitas
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
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Upload Foto Header
          </label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="headerPhoto"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
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
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {headerPhoto ? headerPhoto.name : "max. 2mb"}
            </span>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Fasilitas <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama fasilitas"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Upload Foto Lainnya
          </label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="otherPhoto"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
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
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {otherPhoto ? otherPhoto.name : "max. 2mb"}
            </span>
          </div>
        </div>

        <div className="mb-6 flex">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Deskripsi Overview
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={5}
            placeholder="Masukkan deskripsi overview"
            disabled={loading}
          ></textarea>
        </div>

        <div className="mb-6 flex">
          <label
            htmlFor="facilityService"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Layanan Fasilitas
          </label>
          <textarea
            id="facilityService"
            value={facilityService}
            onChange={(e) => setFacilityService(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={8}
            placeholder="Masukkan layanan fasilitas"
            disabled={loading}
          ></textarea>
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
