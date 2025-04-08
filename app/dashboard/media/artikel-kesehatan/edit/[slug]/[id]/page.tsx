"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { WysiwygEditorHandle } from "@/app/components/WysiwygEditor";
import { 
  getArtikelKesehatanById, 
  updateArtikelKesehatan
} from "@/app/services/artikelKesehatanService";
import { getMasterDokter, DokterItem } from "@/app/services/masterDokterService";
import { getKategoriList, createKategori, Kategori } from "@/app/services/masterKategoriService";
import { KategoriSelect, OptionType } from "@/app/components/CreatableSelect";
import Select from "react-select";

// Import komponen WysiwygEditor secara dynamic untuk menghindari error SSR
const WysiwygEditor = dynamic(() => import('@/app/components/WysiwygEditor'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse"></div>,
});

/**
 * Halaman untuk mengedit Artikel Kesehatan
 * @returns {JSX.Element}
 */
export default function EditArtikelKesehatan() {
  const router = useRouter();
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";
  
  // State untuk form
  const [kategoriId, setKategoriId] = useState("");
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [dokterIds, setDokterIds] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [currentThumbnail, setCurrentThumbnail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk dropdown
  const [kategoriOptions, setKategoriOptions] = useState<OptionType[]>([]);
  const [dokterOptions, setDokterOptions] = useState<OptionType[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingDokter, setLoadingDokter] = useState(false);
  
  const editorRef = useRef<WysiwygEditorHandle>(null);

  /**
   * Fungsi untuk memuat data artikel kesehatan dari API berdasarkan ID
   */
  const fetchArtikelKesehatan = async () => {
    try {
      setIsLoading(true);
      const response = await getArtikelKesehatanById(slug as string, id as string);
      
      if (response.success) {
        const data = response.data;
        setJudul(data.judul);
        setKategoriId(data.kategori_id);
        setKonten(data.konten);
        setCurrentThumbnail(data.foto || "");
        
        // Set dokter IDs jika ada
        if (data.dokter_terkait && Array.isArray(data.dokter_terkait)) {
          setDokterIds(data.dokter_terkait);
        }
        
        // Set konten ke editor jika ref tersedia
        if (editorRef.current) {
          editorRef.current.setContent(data.konten);
        }
      } else {
        setError("Gagal memuat data artikel kesehatan");
      }
    } catch (error) {
      console.error("Error fetching artikel kesehatan:", error);
      setError("Gagal memuat data artikel kesehatan");
    } finally {
      setIsLoading(false);
    }
  };

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
        flag: 'ArtikelKesehatan',
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
      const response = await createKategori(name, 'ArtikelKesehatan');
      
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
   * Fungsi untuk memuat opsi dokter
   */
  const fetchDokterOptions = async () => {
    try {
      setLoadingDokter(true);
      const response = await getMasterDokter({ per_page: 100 });
      
      if (response.success && response.data && response.data.data) {
        setDokterOptions(
          response.data.data.map((item: DokterItem) => ({
            label: item.nama_dokter,
            value: item.id,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching dokter options:", error);
      setError("Gagal memuat data dokter");
    } finally {
      setLoadingDokter(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchKategoriOptions();
    fetchDokterOptions();
    fetchArtikelKesehatan();
  }, [id, slug]);

  /**
   * Fungsi untuk menangani unggahan thumbnail
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk menangani perubahan select multiple dokter
   * @param selected - Opsi yang dipilih dari react-select
   */
  const handleDokterSelectChange = (selected: readonly OptionType[]) => {
    const selectedIds = selected.map(option => option.value);
    setDokterIds(selectedIds);
  };

  /**
   * Fungsi untuk mereset form ke data awal
   */
  const handleResetForm = () => {
    fetchArtikelKesehatan();
    setThumbnail(null);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} Hasil validasi
   */
  const validateForm = () => {
    if (!judul) {
      setError("Judul artikel wajib diisi.");
      return false;
    }

    if (!kategoriId) {
      setError("Kategori harus dipilih");
      return false;
    }

    if (!konten) {
      setError("Konten artikel wajib diisi.");
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
      formData.append("judul", judul);
      formData.append("kategori_id", kategoriId);
      formData.append("konten", editorContent);
      
      // Tambahkan dokter_terkait sebagai array
      if (dokterIds.length > 0) {
        dokterIds.forEach(id => {
          formData.append("dokter_terkait[]", id);
        });
      }

      if (thumbnail) {
        formData.append("foto", thumbnail);
      }

      const response = await updateArtikelKesehatan(id as string, formData);

      if (response.success) {
        // Redirect ke halaman artikel kesehatan setelah berhasil
        router.push("/dashboard/media/artikel-kesehatan");
      } else {
        setError("Gagal mengupdate artikel kesehatan");
      }
    } catch (error: any) {
      console.error("Error updating artikel kesehatan:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat mengupdate artikel kesehatan"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Artikel Kesehatan
        </h1>
        <Link
          href="/dashboard/media/artikel-kesehatan"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Edit Artikel */}
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

        {/* Thumbnail Saat Ini dan Upload Thumbnail Baru */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 w-1/4">
              Foto Artikel Saat Ini
            </label>
            <div className="flex-1">
              {currentThumbnail ? (
                <div className="relative h-48 w-full max-w-xs">
                  <Image 
                    src={`${BASE_URL}/storage/${currentThumbnail}`} 
                    alt="Foto Artikel" 
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
              htmlFor="foto"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 w-1/4"
            >
              Upload Foto Baru
            </label>
            <div className="flex items-center flex-1">
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
                {thumbnail ? thumbnail.name : "max. 5mb"}
              </span>
            </div>
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
            placeholder="Masukkan judul artikel"
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
            placeholder="Masukkan konten artikel"
          />
        </div>

        {/* Dokter Terkait - menggunakan react-select */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-orange-600 dark:text-gray-300 mb-4">
            Dokter Spesialis Terkait
          </label>
          <Select
            isMulti
            options={dokterOptions}
            value={dokterOptions.filter(option => dokterIds.includes(option.value))}
            onChange={handleDokterSelectChange}
            isLoading={loadingDokter}
            isDisabled={loading}
            placeholder="Pilih dokter..."
            noOptionsMessage={() => "Tidak ada pilihan dokter"}
            loadingMessage={() => "Memuat data dokter..."}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              // Basic styling to match with other form elements
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

        {/* Tombol Aksi */}
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
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
