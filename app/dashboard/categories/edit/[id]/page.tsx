"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecord } from "@/app/hooks/useRecord";
import AsyncSelect from "react-select/async";
import { useParams, useRouter } from "next/navigation";
import {
  getMasterCategoryById,
  updateMasterCategory,
} from "@/app/services/masterCategoryService";
import { PageHeader } from "@/app/components/ui";

type RecordType = Awaited<ReturnType<typeof getMasterCategoryById>>["data"];

function EditMasterCategoryForm({ record }: { record: RecordType }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: { name: string; page: string; flag: string }) => updateMasterCategory(record.id, data.name, data.page, data.flag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/dashboard/categories");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat memperbarui data kategori"),
  });
  const loading = saveMutation.isPending;

  const [name, setName] = useState(record.name ?? "");
  const [page, setPage] = useState(record.page || "");
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
    setName(record.name ?? "");
    setPage(record.page || "");
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
      <PageHeader title="Edit Kategori" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/categories" />

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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditMasterCategory() {
  const { id } = useParams<{ id: string }>();
  const { data: record, isLoading, isError } = useRecord("categories", id, (recordId) => getMasterCategoryById(recordId));

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

  return <EditMasterCategoryForm key={String(record.id)} record={record} />;
}
