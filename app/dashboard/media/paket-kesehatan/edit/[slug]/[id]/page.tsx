"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  getPaketKesehatanById, 
  updatePaketKesehatan, 
} from "@/app/services/paketKesehatanService";
import { getKategoriList, createKategori, Kategori } from "@/app/services/masterKategoriService";
import { KategoriSelect, OptionType } from "@/app/components/CreatableSelect";

/**
 * Halaman untuk mengedit Paket Kesehatan
 * @returns {JSX.Element}
 */
export default function EditPaketKesehatan() {
  const router = useRouter();
  const { slug, id } = useParams<{ slug: string; id: string }>();

  // State untuk form
  const [kategoriId, setKategoriId] = useState("");
  const [promo, setPromo] = useState(0);
  const [berlakuSampai, setBerlakuSampai] = useState("");
  const [namaPaket, setNamaPaket] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk data dropdown
  const [loadingDropdown, setLoadingDropdown] = useState(true);

  // Update kategori state
  const [kategoriOptions, setKategoriOptions] = useState<OptionType[]>([]);

  // URL dasar API dari variabel lingkungan
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

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
   * Fungsi untuk memuat data kategori untuk dropdown
   */
  const fetchKategoriList = async (search?: string) => {
    try {
      setLoadingDropdown(true);
      const response = await getKategoriList({
        flag: 'PaketKesehatan',
        search: search,
        per_page: 100
      });
      
      if (response.success && Array.isArray(response.data)) {
        setKategoriOptions(formatKategoriOptions(response.data));
      } else {
        console.error("Data kategori bukan array:", response.data);
        setKategoriOptions([]);
      }
    } catch (error) {
      console.error("Error fetching kategori list:", error);
      setError("Gagal memuat data kategori");
      setKategoriOptions([]);
    } finally {
      setLoadingDropdown(false);
    }
  };

  /**
   * Fungsi untuk membuat kategori baru
   * @param name - Nama kategori
   * @returns Hasil pembuatan kategori
   */
  const handleCreateKategori = async (name: string) => {
    try {
      const response = await createKategori(name, 'PaketKesehatan');
      
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
   * Fungsi untuk memuat data paket kesehatan dari API berdasarkan ID
   */
  const fetchPaketKesehatan = async () => {
    try {
      setIsLoading(true);
      const response = await getPaketKesehatanById(slug as string, id as string);
      
      if (response.success) {
        const data = response.data;
        setNamaPaket(data.nama_paket);
        setKategoriId(data.kategori_id);
        setPromo(data.promo);
        setBerlakuSampai(data.berlaku_sampai ? data.berlaku_sampai.split('T')[0] : "");
        setDeskripsi(data.deskripsi || "");
        setCurrentFoto(data.foto || "");
      } else {
        setError("Gagal memuat data paket kesehatan");
      }
    } catch (error) {
      console.error("Error fetching paket kesehatan:", error);
      setError("Gagal memuat data paket kesehatan");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchKategoriList();
    fetchPaketKesehatan();
  }, [id, slug]);

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
   * Fungsi untuk mereset form ke data awal
   */
  const handleResetForm = () => {
    fetchPaketKesehatan();
    setFoto(null);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} Hasil validasi
   */
  const validateForm = () => {
    if (!namaPaket) {
      setError("Nama paket wajib diisi.");
      return false;
    }

    if (!kategoriId) {
      setError("Kategori harus dipilih");
      return false;
    }

    // Jika promo true, berlaku_sampai harus diisi
    if (promo && !berlakuSampai) {
      setError("Tanggal berlaku sampai wajib diisi untuk promo.");
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

      // Mempersiapkan FormData untuk unggah file
      const formData = new FormData();
      formData.append("nama_paket", namaPaket);
      formData.append("kategori_id", kategoriId);
      formData.append("promo", promo ? "1" : "0");
      
      if (berlakuSampai) {
        formData.append("berlaku_sampai", berlakuSampai);
      }
      
      if (deskripsi) {
        formData.append("deskripsi", deskripsi);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updatePaketKesehatan(id as string, formData);

      if (response.success) {
        router.push("/dashboard/media/paket-kesehatan");
      } else {
        setError("Gagal mengupdate paket kesehatan");
      }
    } catch (error: any) {
      console.error("Error updating paket kesehatan:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat mengupdate paket kesehatan"
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
          Edit Paket Kesehatan
        </h1>
        <Link
          href="/dashboard/media/paket-kesehatan"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Edit Paket Kesehatan */}
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

        {/* Foto Saat Ini dan Upload Foto Baru */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Foto Saat Ini
            </label>
            <div className="flex-1">
              {currentFoto ? (
                <div className="relative h-48 w-full max-w-xs">
                  <Image 
                    src={`${BASE_URL}/storage/${currentFoto}`} 
                    alt="Foto Paket Kesehatan" 
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
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
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
                Browse
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
                {foto ? foto.name : "max. 5mb"}
              </span>
            </div>
          </div>
        </div>

        {/* Kategori - menggunakan CreatableSelect */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="kategori"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            <KategoriSelect
              value={kategoriId}
              options={kategoriOptions}
              onChange={setKategoriId}
              onCreateOption={handleCreateKategori}
              isLoading={loadingDropdown}
              isDisabled={loading}
              placeholder="Pilih atau ketik untuk membuat kategori baru"
              className="w-full"
            />
          </div>
        </div>

        {/* Promo */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Promo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="yes"
                checked={promo === 1}
                onChange={() => setPromo(1)}
                className="mr-2"
                disabled={loading}
              />
              Ya
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="no"
                checked={promo === 0}
                onChange={() => setPromo(0)}
                className="mr-2"
                disabled={loading}
              />
              Tidak
            </label>
          </div>
        </div>

        {/* Berlaku Sampai - selalu ditampilkan */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="berlakuSampai"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Berlaku Sampai
          </label>
          <input
            id="berlakuSampai"
            type="date"
            value={berlakuSampai}
            onChange={(e) => setBerlakuSampai(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
        </div>

        {/* Nama Paket */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaPaket"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Paket <span className="text-red-500">*</span>
          </label>
          <input
            id="namaPaket"
            type="text"
            value={namaPaket}
            onChange={(e) => setNamaPaket(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama paket"
            required
            disabled={loading}
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-6 flex">
          <label
            htmlFor="deskripsi"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={5}
            placeholder="Masukkan deskripsi paket"
            disabled={loading}
          ></textarea>
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
