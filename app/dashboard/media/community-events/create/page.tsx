"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCategoryOptions } from "@/app/hooks/useOptions";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { createCategory } from "@/app/services/masterCategoryService";
import { CategorySelect } from "@/app/components/CreatableSelect";
import { createCommunityEvent } from "@/app/services/communityEventService";
import { PageHeader } from "@/app/components/ui";

const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

export default function CreateCommunityEvent() {
  const router = useRouter();

  const { options: categoryOptions, isLoading: loadingCategory } = useCategoryOptions("CommunityEvent");
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: createCommunityEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-events"] });
      router.push("/dashboard/media/community-events");
    },
    onError: (error: any) => setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan data"),
  });
  const loading = saveMutation.isPending;

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
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

  const handleReset = () => {
    setCategoryId("");
    setTitle("");
    setContent("");
    setPhoto(null);
    setError("");
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
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
      <PageHeader title="Tambah Event & Community Baru" description="Isi data di bawah ini, lalu simpan." backHref="/dashboard/media/community-events" />

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
            Foto <span className="text-red-500">*</span>
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
              {photo ? photo.name : "max. 2mb"}
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
