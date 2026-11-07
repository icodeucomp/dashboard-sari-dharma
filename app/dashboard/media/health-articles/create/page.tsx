"use client";

import { useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoryOptions, useDoctorOptions } from "@/app/hooks/useOptions";
import dynamic from "next/dynamic";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { createHealthArticle } from "@/app/services/healthArticleService";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect, OptionType } from "@/app/components/CreatableSelect";
import Select from "react-select";

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
    <div className="p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Artikel Kesehatan Baru
        </h1>
        <Link
          href="/dashboard/media/health-articles"
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

        <div className="mb-6">
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto Artikel <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <label
              htmlFor="photo"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
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
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {thumbnail ? thumbnail.name : "max. 5mb"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul artikel"
            disabled={loading}
          />
        </div>

        <div className="mb-12">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
