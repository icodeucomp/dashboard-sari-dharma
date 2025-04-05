"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import {
  getLayananUnggulanById,
  updateLayananUnggulan,
} from "@/app/services/layananUnggulanService";
import Image from "next/image";

// Lazy load WYSIWYG editor
const Editor = dynamic(() => import("@/app/components/WysiwygEditor"), {
  ssr: false,
});

/**
 * Komponen utama untuk halaman Edit Layanan Unggulan
 * @returns {JSX.Element}
 */
export default function EditLayananUnggulan() {
  const params = useParams();
  const [namaLayanan, setNamaLayanan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const id = Number(params.id);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

  /**
   * Fungsi untuk memuat data layanan dari API
   */
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getLayananUnggulanById(id);

      if (response.success) {
        const data = response.data;
        setNamaLayanan(data.nama_layanan);
        setDeskripsi(data.deskripsi);
        setCurrentFoto(data.foto);
        setFoto(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data layanan");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchData();
  }, [id]);

  /**
   * Fungsi untuk menangani unggahan file
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi ukuran file (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file tidak boleh lebih dari 2MB");
        return;
      }
      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file harus JPG, JPEG, atau PNG");
        return;
      }
      setFoto(file);
      setError("");
    }
  };

  /**
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLayanan) {
      setError("Nama layanan wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Buat FormData untuk mengirim ke API
      const formData = new FormData();
      formData.append("nama_layanan", namaLayanan);
      formData.append("deskripsi", deskripsi);
      if (foto) {
        formData.append("foto", foto);
      }

      const response = await updateLayananUnggulan(id, formData);

      if (response.success) {
        // Redirect ke halaman layanan unggulan setelah berhasil
        router.push("/dashboard/layanan-unggulan");
      } else {
        setError("Gagal mengupdate layanan unggulan");
      }
    } catch (error: any) {
      console.error("Error updating service:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengupdate layanan"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset formulir ke data awal
   */
  const handleReset = () => {
    fetchData();
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
          Edit Layanan Unggulan
        </h1>
        <div className="py-2 px-4 opacity-0">-</div>
      </div>

      {/* Form Edit Layanan */}
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

        {/* Current Photo */}
        {currentFoto && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Foto Saat Ini
            </label>
            <div className="w-64 h-48 relative mb-2">
              <Image
                src={
                  currentFoto.startsWith("http")
                    ? currentFoto
                    : `${BASE_URL}/storage/${currentFoto}`
                }
                alt="Foto saat ini"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        )}

        {/* Upload Foto */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Ganti Foto
          </label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="foto"
              className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer"
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input
              id="foto"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {foto ? foto.name : "max. 2MB (JPG, JPEG, PNG)"}
            </span>
          </div>
        </div>

        {/* Nama Layanan */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaLayanan"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="namaLayanan"
            type="text"
            value={namaLayanan}
            onChange={(e) => setNamaLayanan(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama layanan"
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-6">
          <label
            htmlFor="deskripsi"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >
            Deskripsi
          </label>
          <Editor
            value={deskripsi}
            onChange={(value: string) => setDeskripsi(value)}
            placeholder="Masukkan deskripsi layanan"
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
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
