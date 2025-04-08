"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { getKarirById, updateKarir } from "@/app/services/karirService";

/**
 * Halaman untuk mengedit Karir
 * @returns {JSX.Element}
 */
export default function EditKarir() {
  const router = useRouter();
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk form
  const [divisi, setDivisi] = useState("");
  const [posisi, setPosisi] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fungsi untuk memuat data karir dari API berdasarkan ID
   */
  const fetchKarir = async () => {
    try {
      setIsLoading(true);
      const response = await getKarirById(slug as string, id as string);
      
      if (response.success) {
        const data = response.data;
        setDivisi(data.divisi);
        setPosisi(data.posisi);
        setLinkPendaftaran(data.link_pendaftaran);
        setCurrentFoto(data.foto || "");
      } else {
        setError("Gagal memuat data karir");
      }
    } catch (error) {
      console.error("Error fetching karir:", error);
      setError("Gagal memuat data karir");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchKarir();
  }, [id, slug]);

  /**
   * Fungsi untuk menangani perubahan file yang diupload
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event file input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk validasi form
   * @returns {boolean} - True jika form valid, false jika tidak
   */
  const validateForm = () => {
    if (!divisi) {
      setError("Divisi wajib diisi.");
      return false;
    }

    if (!posisi) {
      setError("Posisi wajib diisi.");
      return false;
    }

    if (!linkPendaftaran) {
      setError("Link pendaftaran wajib diisi.");
      return false;
    }

    // Validasi format URL
    try {
      new URL(linkPendaftaran);
    } catch {
      setError("Link pendaftaran harus berupa URL yang valid.");
      return false;
    }

    // Validasi ukuran file (max 5MB) jika ada file baru
    if (foto && foto.size > 5 * 1024 * 1024) {
      setError("Ukuran file tidak boleh lebih dari 5MB.");
      return false;
    }

    return true;
  };

  /**
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
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
      formData.append("divisi", divisi);
      formData.append("posisi", posisi);
      formData.append("link_pendaftaran", linkPendaftaran);
      
      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updateKarir(id as string, formData);

      if (response.success) {
        // Redirect ke halaman karir setelah berhasil
        router.push("/dashboard/media/karir");
      } else {
        setError("Gagal mengupdate karir");
      }
    } catch (error: any) {
      console.error("Error updating karir:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat mengupdate karir"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset form ke data awal
   */
  const handleResetForm = () => {
    fetchKarir();
    setFoto(null);
    setError("");
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
          Edit Karir
        </h1>
        <Link
          href="/dashboard/media/karir"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Edit Karir */}
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

        {/* Foto Saat Ini */}
        {currentFoto && (
          <div className="mb-6 flex items-center">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Foto Saat Ini
            </label>
            <div className="w-3/4">
              <div className="relative h-48 w-full max-w-xs">
                <Image 
                  src={`${BASE_URL}/storage/${currentFoto}`} 
                  alt="Foto Karir" 
                  width={300}
                  height={200}
                  className="h-48 object-cover border"
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload Foto Baru */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="foto"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Foto Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="foto"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
              Browse
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            {foto && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {foto.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 5mb</span>
          </div>
        </div>

        {/* Divisi */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="divisi"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Divisi <span className="text-red-500">*</span>
          </label>
          <input
            id="divisi"
            type="text"
            value={divisi}
            onChange={(e) => setDivisi(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan divisi"
            disabled={loading}
          />
        </div>

        {/* Posisi */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="posisi"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Posisi <span className="text-red-500">*</span>
          </label>
          <input
            id="posisi"
            type="text"
            value={posisi}
            onChange={(e) => setPosisi(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan posisi"
            disabled={loading}
          />
        </div>

        {/* Link Pendaftaran */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="linkPendaftaran"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Link Pendaftaran <span className="text-red-500">*</span>
          </label>
          <input
            id="linkPendaftaran"
            type="url"
            value={linkPendaftaran}
            onChange={(e) => setLinkPendaftaran(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan link pendaftaran (contoh: https://example.com)"
            disabled={loading}
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
