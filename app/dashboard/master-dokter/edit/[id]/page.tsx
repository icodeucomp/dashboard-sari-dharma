"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import {
  getMasterDokterById,
  updateMasterDokter,
} from "@/app/services/masterDokterService";

/**
 * Komponen halaman untuk mengedit data master dokter
 * @returns {JSX.Element}
 */
export default function EditMasterDokter() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  const [namaDokter, setNamaDokter] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  /**
   * Fungsi untuk memuat data dokter berdasarkan ID
   */
  const fetchDokter = async () => {
    try {
      setIsLoading(true);
      const response = await getMasterDokterById(id);

      if (response.success) {
        const data = response.data;
        setNamaDokter(data.nama_dokter);
        setCurrentFoto(data.foto || "");
      } else {
        setError("Gagal memuat data dokter");
      }
    } catch (error) {
      console.error("Error fetching dokter:", error);
      setError("Gagal memuat data dokter");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data dokter saat komponen dimount
   */
  useEffect(() => {
    fetchDokter();
  }, [id]);

  /**
   * Fungsi untuk menangani perubahan input file foto
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
    fetchDokter();
    setFoto(null);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} - Hasil validasi
   */
  const validateForm = () => {
    if (!namaDokter.trim()) {
      setError("Nama dokter tidak boleh kosong");
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
      formData.append("nama_dokter", namaDokter);
      
      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updateMasterDokter(id, formData);
      
      if (response.success) {
        // Redirect ke halaman master dokter setelah berhasil
        router.push("/dashboard/master-dokter");
      } else {
        setError("Gagal memperbarui data dokter");
      }
    } catch (error: any) {
      console.error("Error updating master dokter:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat memperbarui data dokter"
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan halaman loading saat data sedang dimuat
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
          Edit Dokter
        </h1>
        <Link
          href="/dashboard/master-dokter"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form edit dokter */}
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

        {/* Nama Dokter */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaDokter"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Dokter <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="namaDokter"
            value={namaDokter}
            onChange={(e) => setNamaDokter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama dokter"
            required
            disabled={loading}
          />
        </div>

        {/* Foto Saat Ini */}
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
                    alt="Foto Dokter"
                    width={200}
                    height={200}
                    className="h-48 object-cover border"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Tidak ada foto</p>
              )}
            </div>
          </div>
        </div>

        {/* Upload Foto */}
        <div className="mb-6 flex items-center">
          <label
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
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
              {foto ? foto.name : "max. 2mb"}
            </span>
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
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}