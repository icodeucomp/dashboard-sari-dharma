"use client";

import { useState, useRef } from "react";
import { useRecord } from "@/app/hooks/useRecord";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect } from "@/app/components/CreatableSelect";
import {
  getCommunityEventById,
  updateCommunityEvent
} from "@/app/services/communityEventService";
import { PageHeader } from "@/app/components/ui";

const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

type RecordType = Awaited<ReturnType<typeof getCommunityEventById>>["data"];

function EditCommunityEventForm({ record }: { record: RecordType }) {
  const router = useRouter();

  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("CommunityEvent");
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (data: FormData) => updateCommunityEvent(record.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-events"] });
      router.push("/dashboard/media/community-events");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat mengupdate data"),
  });
  const loading = saveMutation.isPending;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const [categoryId, setCategoryId] = useState(record.category_id ?? "");
  const [title, setTitle] = useState(record.title ?? "");
  const [content, setContent] = useState(record.content ?? "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(record.photo || "");
  const [error, setError] = useState("");

  const editorRef = useRef<WysiwygEditorHandle>(null);

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory(name, "CommunityEvent"),
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
    setTitle(record.title ?? "");
    setCategoryId(record.category_id ?? "");
    setContent(record.content ?? "");
    setCurrentPhoto(record.photo || "");
    setPhoto(null);
    setError("");
  };

  const validateForm = () => {
    if (!title) {
      setError("Judul wajib diisi.");
      return false;
    }

    if (!categoryId) {
      setError("Kategori harus dipilih");
      return false;
    }

    if (!content) {
      setError("Konten wajib diisi.");
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
      formData.append("category_id", categoryId);
      formData.append("title", title);
      formData.append("content", editorContent);

      if (photo) {
        formData.append("photo", photo);
      }

      saveMutation.mutate(formData);
  };

  return (
    <div className="page">
      <PageHeader title="Edit Event & Community" description="Ubah data di bawah ini, lalu simpan perubahan." backHref="/dashboard/media/community-events" />

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
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4">
              Foto Saat Ini
            </label>
            <div className="flex-1">
              {currentPhoto ? (
                <div className="relative h-48 w-full max-w-xs">
                  <Image
                    src={`${BASE_URL}/storage/${currentPhoto}`}
                    alt="Foto Event & Community"
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

          <div className="flex items-center">
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4"
            >
              Upload Foto Baru
            </label>
            <div className="flex flex-wrap items-center gap-3 md:flex-1">
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
                {photo ? photo.name : "max. 2mb"}
              </span>
            </div>
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
            placeholder="Masukkan judul"
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
            placeholder="Masukkan konten"
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditCommunityEvent() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { data: record, isLoading, isError } = useRecord("community-events", id, (recordId) => getCommunityEventById(slug, recordId));

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

  return <EditCommunityEventForm key={String(record.id)} record={record} />;
}
