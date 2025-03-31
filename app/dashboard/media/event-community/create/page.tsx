"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";

// Import komponen WysiwygEditor secara dynamic untuk menghindari error SSR
const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

/**
 * Halaman untuk menambahkan Event & Community baru
 * @returns {JSX.Element}
 */
export default function CreateEventCommunity() {
  const [kategori, setKategori] = useState("");
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const editorRef = useRef<WysiwygEditorHandle>(null);

  /**
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ambil konten editor dari ref
    const editorContent = editorRef.current?.getContent() || "";

    if (!kategori || !judul || !editorContent) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Simulasi pengiriman data
    console.log({
      kategori,
      judul,
      konten: editorContent,
    });

    // Redirect ke halaman Event & Community setelah berhasil
    router.push("/dashboard/media/event-community");
  };

  /**
   * Fungsi untuk mereset formulir
   */
  const handleReset = () => {
    setKategori("");
    setJudul("");
    setKonten("");
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Event & Community
        </h1>
      </div>

      {/* Form Tambah Event */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Kategori */}
        <div className="mb-6">
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Pilih Kategori</option>
            <option value="Komunitas">Komunitas</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Judul */}
        <div className="mb-6">
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul event"
          />
        </div>

        {/* Konten */}
        <div className="mb-12"> {/* Margin-bottom untuk editor */}
          <label
            htmlFor="konten"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Content
          </label>
          <WysiwygEditor 
            ref={editorRef} 
            value={konten}
            onChange={(content) => setKonten(content)}
            placeholder="Masukkan konten event"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-6 rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
