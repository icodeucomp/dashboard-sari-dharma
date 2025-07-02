"use client";

import { useState } from "react";
import AsyncSelect from "react-select/async";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createMasterKategori } from "@/app/services/masterKategoriService";

/**
 * Komponen halaman untuk menambah master kategori baru
 * @returns {JSX.Element}
 */
export default function CreateMasterKategori() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [page, setPage] = useState("");
  // State untuk react-select flag
  const [selectedFlag, setSelectedFlag] = useState<{ value: string; label: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Opsi flag yang tersedia
   */
  const flagOptions = [
    { value: "PaketKesehatan", label: "Paket Kesehatan" },
    { value: "ArtikelKesehatan", label: "Artikel Kesehatan" },
    { value: "EventCommunity", label: "Event & Community" },
    { value: "KarirKlinik", label: "Karir Klinik" },
    { value: "IndikatorMutu", label: "Indikator Mutu" },
  ];

  /**
   * Fungsi untuk load opsi flag secara async (dummy, karena data statis)
   * @param {string} inputValue - input pencarian
   * @returns {Promise<{value: string, label: string}[]>}
   */
  const loadFlagOptions = async (inputValue: string) => {
    return flagOptions.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleResetForm = () => {
    setName("");
    setPage("");
    setSelectedFlag(null);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} - Hasil validasi
   */
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

  /**
   * Fungsi untuk menangani submit form
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await createMasterKategori(name, page, selectedFlag?.value || "");
      if (response.success) {
        router.push("/dashboard/master-kategori");
      } else {
        setError("Gagal menambahkan data kategori");
      }
    } catch (error: any) {
      console.error("Error creating master kategori:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat menambahkan data kategori"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Kategori Baru
        </h1>
        <Link
          href="/dashboard/master-kategori"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form tambah kategori */}
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

        {/* Nama Kategori */}
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

        {/* Page */}
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

        {/* Flag dengan react-select */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="flag"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Flag <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            {/*
              Komponen AsyncSelect digunakan untuk memilih flag secara async
              Lihat dokumentasi react-select AsyncSelect
            */}
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

        {/* Tombol Simpan dan Reset */}
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