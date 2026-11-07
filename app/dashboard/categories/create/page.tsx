"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncSelect from "react-select/async";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createMasterCategory } from "@/app/services/masterCategoryService";

export default function CreateMasterCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: { name: string; page: string; flag: string }) => createMasterCategory(data.name, data.page, data.flag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/dashboard/categories");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan data kategori"),
  });
  const loading = saveMutation.isPending;

  const [name, setName] = useState("");
  const [page, setPage] = useState("");
  const [selectedFlag, setSelectedFlag] = useState<{ value: string; label: string } | null>(null);
  const [error, setError] = useState("");

  const flagOptions = [
    { value: "HealthPackage", label: "Paket Kesehatan" },
    { value: "HealthArticle", label: "Artikel Kesehatan" },
    { value: "CommunityEvent", label: "Event & Community" },
    { value: "CareerClinic", label: "Karir Klinik" },
    { value: "QualityIndicator", label: "Indikator Mutu" },
  ];

  const loadFlagOptions = async (inputValue: string) => {
    return flagOptions.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleResetForm = () => {
    setName("");
    setPage("");
    setSelectedFlag(null);
    setError("");
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError("Nama kategori tidak boleh kosong");
      return false;
    }
    if (!selectedFlag) {
      setError("Flag kategori harus dipilih");
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
    saveMutation.mutate({ name, page, flag: selectedFlag?.value || "" });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Kategori Baru
        </h1>
        <Link
          href="/dashboard/categories"
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

        <div className="mb-6 flex items-center">
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama kategori"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="page"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Page
          </label>
          <input
            type="text"
            id="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan page (opsional)"
            disabled={loading}
          />
        </div>

        <div className="mb-6 flex items-center">
          <label
            htmlFor="flag"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Flag <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <AsyncSelect
              cacheOptions
              defaultOptions={flagOptions}
              loadOptions={loadFlagOptions}
              inputId="flag"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              isDisabled={loading}
              placeholder="Pilih Flag..."
              value={selectedFlag}
              onChange={(option) => setSelectedFlag(option)}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                }),
                menu: (base) => ({ ...base, zIndex: 20 }),
              }}
              required
            />
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
            {loading ? "Saving..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}