"use client";

import { useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoryOptions, useDoctorOptions } from "@/app/hooks/useOptions";
import dynamic from "next/dynamic";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { createHealthArticle } from "@/app/services/healthArticleService";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect, OptionType } from "@/app/components/CreatableSelect";
import Select from "react-select";
import { PageHeader } from "@/app/components/ui";

const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

export default function AddHealthArticle() {
  const router = useRouter();

  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("HealthArticle");
  const { options: doctorOptions, isLoading: loadingDoctor } = useDoctorOptions();
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createHealthArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-articles"] });
      router.push("/dashboard/media/health-articles");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan artikel kesehatan"),
  });
  const loading = saveMutation.isPending;

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [doctorIds, setDoctorIds] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState("");

  const editorRef = useRef<WysiwygEditorHandle>(null);

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(name, "HealthArticle"),
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
      setThumbnail(e.target.files[0]);
    }
  };

  const handleResetForm = () => {
    setCategoryId("");
    setTitle("");
    setContent("");
    setDoctorIds([]);
    setThumbnail(null);
    setError("");
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
  };

  const validateForm = () => {
    if (!title) {
      setError("Judul artikel wajib diisi.");
      return false;
    }

    if (!categoryId) {
      setError("Kategori harus dipilih");
      return false;
    }

    if (!content) {
      setError("Konten artikel wajib diisi.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const editorContent = editorRef.current?.getContent() || "";
    setContent(editorContent);

    if (!validateForm()) {
      return;
    }

    setError("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", categoryId);
      formData.append("content", editorContent);

      if (doctorIds.length > 0) {
        doctorIds.forEach(id => {
          formData.append("related_doctors[]", id);
        });
      }

      if (thumbnail) {
        formData.append("photo", thumbnail);
      }

      saveMutation.mutate(formData);
  };

  const handleDoctorSelectChange = (selected: readonly OptionType[]) => {
    const selectedIds = selected.map(option => option.value);
    setDoctorIds(selectedIds);
  };

  return (
    <div className="page">
      <PageHeader title="Tambah Artikel Kesehatan Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/health-articles" />

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
          <label
            htmlFor="photo"
            className="form-label-block"
          >
            Foto Artikel <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <label
              htmlFor="photo"
              className={`btn btn-outline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Pilih Gambar
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
              {thumbnail ? thumbnail.name : "max. 5mb"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="form-label-block"
          >
            Kategori <span className="text-red-500">*</span>
          </label>
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

        <div className="mb-6">
          <label
            htmlFor="title"
            className="form-label-block"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Masukkan judul artikel"
            disabled={loading}
          />
        </div>

        <div className="mb-12">
          <label
            htmlFor="content"
            className="form-label-block"
          >
            Konten <span className="text-red-500">*</span>
          </label>
          <WysiwygEditor
            ref={editorRef}
            value={content}
            onChange={(content) => setContent(content)}
            placeholder="Masukkan konten artikel"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-bold text-orange-600 dark:text-gray-300 mb-4">
            Dokter Spesialis Terkait
          </label>
          <Select
            isMulti
            options={doctorOptions}
            value={doctorOptions.filter(option => doctorIds.includes(option.value))}
            onChange={handleDoctorSelectChange}
            isLoading={loadingDoctor}
            isDisabled={loading}
            placeholder="Pilih dokter..."
            noOptionsMessage={() => "Tidak ada pilihan dokter"}
            loadingMessage={() => "Memuat data dokter..."}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: state.isFocused ? '#f97316' : '#d1d5db',
                boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#f97316' : '#9ca3af',
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#ffedd5',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#9a3412',
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#9a3412',
                '&:hover': {
                  backgroundColor: '#fdba74',
                  color: '#7c2d12',
                },
              }),
            }}
          />
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
