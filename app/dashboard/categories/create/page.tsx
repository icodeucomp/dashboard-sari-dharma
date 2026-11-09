"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncSelect from "react-select/async";
import { useRouter } from "next/navigation";
import { createMasterCategory } from "@/app/services/masterCategoryService";
import { PageHeader } from "@/app/components/ui";

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
    <div className="page">
      <PageHeader title="Tambah Kategori Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/categories" />

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
          <label
            htmlFor="name"
            className="form-label"
          >
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Masukkan nama kategori"
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="page"
            className="form-label"
          >
            Page
          </label>
          <input
            type="text"
            id="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="form-input"
            placeholder="Masukkan page (opsional)"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label
            htmlFor="flag"
            className="form-label"
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