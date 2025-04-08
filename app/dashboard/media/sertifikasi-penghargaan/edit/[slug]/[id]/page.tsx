"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { getSertifikasiPenghargaanById, updateSertifikasiPenghargaan } from "@/app/services/sertifikasiPenghargaanService";

/**
 * Halaman untuk mengedit Sertifikasi & Penghargaan
 * @returns {JSX.Element}
 */
export default function EditSertifikasiPenghargaan() {
  const router = useRouter();
  const { slug, id } = useParams<{ slug: string; id: string }>();

  const [judul, setJudul] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fungsi untuk memuat data sertifikasi & penghargaan dari API berdasarkan ID
   */
  const fetchSertifikasiPenghargaan = async () => {
    try {
      setIsLoading(true);
      const response = await getSertifikasiPenghargaanById(slug as string, id as string);

      if (response.success) {
        const data = response.data;
        setJudul(data.judul);
        setCurrentFile(data.file_pdf || "");
        setCurrentFoto(data.foto || "");
      } else {
        setError("Gagal memuat data sertifikasi & penghargaan");
      }
    } catch (error) {
      console.error("Error fetching sertifikasi:", error);
      setError("Gagal memuat data sertifikasi & penghargaan");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchSertifikasiPenghargaan();
  }, [id, slug]);

  /**
   * Fungsi untuk menangani perubahan file yang diupload
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event file input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk validasi form
   * @returns {boolean} - True jika form valid, false jika tidak
   */
  const validateForm = () => {
    if (!judul) {
      setError("Judul wajib diisi.");
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

      if (file) {
        formData.append("file_pdf", file);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updateSertifikasiPenghargaan(id as string, formData);

      if (response.success) {
        router.push("/dashboard/media/sertifikasi-penghargaan");
      } else {
        setError("Gagal mengupdate sertifikasi & penghargaan");
      }
    } catch (error) {
      console.error("Error updating sertifikasi:", error);
      setError("Terjadi kesalahan saat mengupdate sertifikasi & penghargaan");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset form ke data awal
   */
  const handleReset = () => {
    fetchSertifikasiPenghargaan();
    setFile(null);
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
          Edit Sertifikasi & Penghargaan
        </h1>
      </div>

      {/* Form Edit Sertifikasi */}
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
            placeholder="Masukkan judul sertifikasi"
            disabled={loading}
          />
        </div>

        {/* File Saat Ini */}
        <div className="mb-6 flex items-center">
          <label
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            File Saat Ini
          </label>
          <div className="w-3/4">
            {currentFile ? (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {currentFile}
              </a>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Tidak ada file</p>
            )}
          </div>
        </div>

        {/* Upload File Baru */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="file"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload File Baru
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="file"
              className={`flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
              Browse
            </label>
            <input
              id="file"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            {file && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {file.name}
              </span>
            )}
            <span className="text-sm text-red-500">max. 5mb</span>
          </div>
        </div>

        {/* Foto Saat Ini */}
        <div className="mb-6 flex items-center">
          <label
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Foto Saat Ini
          </label>
          <div className="w-3/4">
            {currentFoto ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentFoto}`}
                alt="Foto Sertifikasi"
                className="w-32 h-32 object-cover border"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Tidak ada foto</p>
            )}
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
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
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
            onClick={handleReset}
            disabled={loading}
            className={`border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
