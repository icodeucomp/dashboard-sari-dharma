"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload, mdiFilePdfBox } from "@mdi/js";
import { getIndikatorMutuById, updateIndikatorMutu } from "@/app/services/indikatorMutuService";

/**
 * Halaman untuk mengedit Indikator Mutu
 * @returns {JSX.Element}
 */
export default function EditIndikatorMutu() {
  const router = useRouter();
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  // State untuk form
  const [judul, setJudul] = useState("");
  const [filePdf, setFilePdf] = useState<File | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState("");
  const [currentFoto, setCurrentFoto] = useState(""); // Tambah state untuk currentFoto
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fungsi untuk memuat data indikator mutu dari API berdasarkan ID
   */
  const fetchIndikatorMutu = async () => {
    try {
      setIsLoading(true);
      const response = await getIndikatorMutuById(slug as string, id as string);
      
      if (response.success) {
        const data = response.data;
        setJudul(data.judul);
        setCurrentFile(data.file_pdf || "");
        setCurrentFoto(data.foto || ""); // Set current foto
      } else {
        setError("Gagal memuat data indikator mutu");
      }
    } catch (error) {
      console.error("Error fetching indikator mutu:", error);
      setError("Gagal memuat data indikator mutu");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchIndikatorMutu();
  }, [id, slug]);

  /**
   * Fungsi untuk menangani perubahan file PDF yang diupload
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event file input
   */
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilePdf(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk menangani perubahan file foto yang diupload
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event file input
   */
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk memvalidasi form
   * @returns {boolean} - True jika form valid, false jika tidak
   */
  const validateForm = () => {
    if (!judul) {
      setError("Judul wajib diisi.");
      return false;
    }

    // Validasi ukuran file PDF jika ada (max 5MB)
    if (filePdf && filePdf.size > 5 * 1024 * 1024) {
      setError("Ukuran file PDF tidak boleh lebih dari 5MB.");
      return false;
    }

    // Validasi ukuran file foto jika ada (max 2MB)
    if (foto && foto.size > 2 * 1024 * 1024) {
      setError("Ukuran file foto tidak boleh lebih dari 2MB.");
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
      formData.append("judul", judul);
      
      if (filePdf) {
        formData.append("file_pdf", filePdf);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updateIndikatorMutu(id as string, formData);

      if (response.success) {
        // Redirect ke halaman indikator mutu setelah berhasil
        router.push("/dashboard/media/indikator-mutu");
      } else {
        setError("Gagal mengupdate indikator mutu");
      }
    } catch (error: any) {
      console.error("Error updating indikator mutu:", error);
      setError(
        error.response?.data?.message || 
        "Terjadi kesalahan saat mengupdate indikator mutu"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset form ke data awal
   */
  const handleResetForm = () => {
    fetchIndikatorMutu();
    setFilePdf(null);
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
          Edit Indikator Mutu
        </h1>
        <Link
          href="/dashboard/media/indikator-mutu"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form Edit Indikator Mutu */}
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

        {/* File PDF Saat Ini */}
        {currentFile && (
          <div className="mb-6 flex items-center">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              PDF Saat Ini
            </label>
            <div className="w-3/4 flex items-center gap-4">
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <Icon path={mdiFilePdfBox} size={1.5} className="text-red-600 dark:text-red-400 mr-2" />
                <a 
                  href={`${BASE_URL}/storage/${currentFile}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lihat File PDF
                </a>
              </div>
            </div>
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
                  alt="Foto Indikator Mutu" 
                  width={300}
                  height={200}
                  className="h-48 object-cover border rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Judul */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="judul"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="judul"
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-3/4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul indikator mutu"
            disabled={loading}
          />
        </div>

        {/* Upload PDF Baru */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="file_pdf"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload PDF Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="file_pdf"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
              Browse
            </label>
            <input
              id="file_pdf"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfChange}
              disabled={loading}
            />
            {filePdf && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filePdf.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 5mb</span>
          </div>
        </div>

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
              onChange={handleFotoChange}
              disabled={loading}
            />
            {foto && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {foto.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 2mb</span>
          </div>
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
