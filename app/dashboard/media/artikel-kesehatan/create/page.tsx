"use client";

import { useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete } from "@mdi/js";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";

// Import komponen WysiwygEditor secara dynamic untuk menghindari error SSR
const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

/**
 * Halaman untuk menambahkan Artikel Kesehatan baru
 * @returns {JSX.Element}
 */
export default function AddArtikelKesehatan() {
  // State untuk form
  const [kategori, setKategori] = useState("");
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [dokterTerkait, setDokterTerkait] = useState([""]);
  const editorRef = useRef<WysiwygEditorHandle>(null);

  const dokterOptions = [
    "dr. Bambang Sutoyo, Sp.A",
    "dr. Siti Aminah, Sp.B",
    "dr. Rudi Hartono, Sp.C",
  ];

  /**
   * Fungsi untuk menambah input dokter terkait
   */
  const handleAddDokter = () => {
    setDokterTerkait([...dokterTerkait, ""]);
  };

  /**
   * Fungsi untuk menghapus input dokter terkait
   * @param {number} index - Index dokter yang akan dihapus
   */
  const handleDeleteDokter = (index: number) => {
    const updatedDokter = dokterTerkait.filter((_, i) => i !== index);
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk mengubah nilai dokter terkait
   * @param {number} index - Index dokter terkait
   * @param {string} value - Nilai baru
   */
  const handleDokterChange = (index: number, value: string) => {
    const updatedDokter = [...dokterTerkait];
    updatedDokter[index] = value;
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleResetForm = () => {
    setKategori("");
    setJudul("");
    setKonten("");
    setDokterTerkait([""]);
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
  };

  /**
   * Fungsi untuk menangani pengiriman form
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ambil konten editor dari ref
    const editorContent = editorRef.current?.getContent() || "";
    
    console.log({
      kategori,
      judul,
      konten: editorContent,
      dokterTerkait,
    });
    // Tambahkan logika pengiriman data di sini
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Artikel Kesehatan
        </h1>
        <Link
          href="/dashboard/media/artikel-kesehatan"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Back
        </Link>
      </div>

      {/* Form Tambah Artikel */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
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
            <option value="Edukasi Kesehatan">Edukasi Kesehatan</option>
            <option value="Berita Kesehatan">Berita Kesehatan</option>
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
            placeholder="Masukkan judul artikel"
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
            placeholder="Masukkan konten artikel"
          />
        </div>

        {/* Dokter Terkait */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-orange-600 dark:text-gray-300 mb-4">
            Dokter Spesialis Terkait
          </label>
          {dokterTerkait.map((dokter, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <select
                value={dokter}
                onChange={(e) => handleDokterChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>
                  Pilih Dokter
                </option>
                {dokterOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDokter(index)}
                  className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md"
                >
                  <Icon path={mdiDelete} size={0.8} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDokter}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add More
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleResetForm}
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
