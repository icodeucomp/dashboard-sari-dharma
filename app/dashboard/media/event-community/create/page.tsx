"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Link from "next/link";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { getKategoriList, createKategori, Kategori } from "@/app/services/masterKategoriService";
import { KategoriSelect, OptionType } from "@/app/components/CreatableSelect";
import { createEventCommunity } from "@/app/services/eventCommunityService";

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
  const router = useRouter();

  // State untuk form
  const [kategoriId, setKategoriId] = useState("");
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk dropdown
  const [kategoriOptions, setKategoriOptions] = useState<OptionType[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(false);

  const editorRef = useRef<WysiwygEditorHandle>(null);

  /**
   * Fungsi untuk mengubah data kategori menjadi format opsi dropdown
   * @param kategori - Array data kategori
   * @returns Array opsi untuk dropdown
   */
  const formatKategoriOptions = (kategori: Kategori[]): OptionType[] => {
    return kategori.map(item => ({
      label: item.name,
      value: item.id
    }));
  };

  /**
   * Fungsi untuk memuat opsi kategori
   */
  const fetchKategoriOptions = async () => {
    try {
      setLoadingKategori(true);
      const response = await getKategoriList({
        flag: 'EventCommunity',
        per_page: 100
      });
      
      if (response.success && Array.isArray(response.data)) {
        setKategoriOptions(formatKategoriOptions(response.data));
      }
    } catch (error) {
      console.error("Error fetching kategori options:", error);
      setError("Gagal memuat data kategori");
    } finally {
      setLoadingKategori(false);
    }
  };

  /**
   * Fungsi untuk membuat kategori baru
   * @param name - Nama kategori
   * @returns Hasil pembuatan kategori
   */
  const handleCreateKategori = async (name: string) => {
    try {
      const response = await createKategori(name, 'EventCommunity');
      
      if (response.success) {
        // Tambahkan kategori baru ke opsi
        const newKategori = response.data;
        const newOption: OptionType = {
          label: newKategori.name,
          value: newKategori.id
        };
        
        setKategoriOptions(prev => [...prev, newOption]);
        
        return {
          success: true,
          newOption
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error("Error creating new kategori:", error);
      setError("Gagal membuat kategori baru");
      return { success: false };
    }
  };

  /**
   * Memuat data kategori saat komponen dimount
   */
  useEffect(() => {
    fetchKategoriOptions();
  }, []);

  /**
   * Fungsi untuk menangani unggahan file
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleReset = () => {
    setKategoriId("");
    setJudul("");
    setKonten("");
    setFoto(null);
    setError("");
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} Hasil validasi
   */
  const validateForm = () => {
    if (!judul) {
      setError("Judul wajib diisi.");
      return false;
    }

    if (!kategoriId) {
      setError("Kategori harus dipilih");
      return false;
    }

    if (!konten) {
      setError("Konten wajib diisi.");
      return false;
    }

    return true;
  };

  /**
   * Fungsi untuk menangani pengiriman form
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ambil konten editor dari ref
    const editorContent = editorRef.current?.getContent() || "";
    setKonten(editorContent);
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Mempersiapkan FormData untuk unggah file
      const formData = new FormData();
      formData.append("kategori_id", kategoriId);
      formData.append("judul", judul);
      formData.append("konten", editorContent);

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await createEventCommunity(formData);

      if (response.success) {
        // Redirect ke halaman Event & Community setelah berhasil
        router.push("/dashboard/media/event-community");
      } else {
        setError("Gagal menambahkan data");
      }
    } catch (error: any) {
      console.error("Error creating event community:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat menambahkan data"
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
          Tambah Event & Community Baru
        </h1>
        <Link
          href="/dashboard/media/event-community"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Tambah Event & Community */}
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

        {/* Upload Foto */}
        <div className="mb-6">
          <label
            htmlFor="foto"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Foto <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <label
              htmlFor="foto"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Pilih Gambar
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {foto ? foto.name : "max. 2mb"}
            </span>
          </div>
        </div>

        {/* Kategori - menggunakan CreatableSelect */}
        <div className="mb-6">
          <label
            htmlFor="kategori"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Kategori <span className="text-red-500">*</span>
          </label>
          <KategoriSelect
            value={kategoriId}
            options={kategoriOptions}
            onChange={setKategoriId}
            onCreateOption={handleCreateKategori}
            isLoading={loadingKategori}
            isDisabled={loading}
            placeholder="Pilih atau ketik untuk membuat kategori baru"
            className="w-full"
          />
        </div>

        {/* Judul */}
        <div className="mb-6">
          <label
            htmlFor="judul"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul"
            disabled={loading}
          />
        </div>

        {/* Konten */}
        <div className="mb-12"> {/* Margin-bottom untuk editor */}
          <label
            htmlFor="konten"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Konten <span className="text-red-500">*</span>
          </label>
          <WysiwygEditor 
            ref={editorRef}
            value={konten}
            onChange={(content) => setKonten(content)}
            placeholder="Masukkan konten"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
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
