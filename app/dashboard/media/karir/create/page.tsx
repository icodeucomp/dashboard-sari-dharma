"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { createKarir } from "@/app/services/karirService";

/**
 * Halaman untuk menambahkan Karir baru
 * @returns {JSX.Element}
 */
export default function AddKarir() {
  const [divisi, setDivisi] = useState("");
  const [posisi, setPosisi] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    if (!foto) {
      setError("Foto wajib diupload.");
      return false;
    }

    // Validasi ukuran file (max 5MB)
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

      const response = await createKarir(formData);

      if (response.success) {
        // Redirect ke halaman karir setelah berhasil
        router.push("/dashboard/media/karir");
      } else {
        setError("Gagal menambahkan karir");
      }
    } catch (error: any) {
      console.error("Error creating karir:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat menambahkan karir"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset formulir
   */
  const handleReset = () => {
    setDivisi("");
    setPosisi("");
    setLinkPendaftaran("");
    setFoto(null);
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Karir Baru
        </h1>
        <Link
          href="/dashboard/media/karir"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Tambah Karir */}
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
        <div className="mb-6 flex items-center">
          <label
            htmlFor="foto"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Foto <span className="text-red-500">*</span>
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
