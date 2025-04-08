"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { getLayananFasilitasById, updateLayananFasilitas } from "@/app/services/layananFasilitasService";

/**
 * Komponen utama untuk halaman Edit Layanan & Fasilitas
 * @returns {JSX.Element}
 */
export default function EditLayananFasilitas() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const router = useRouter();

  const [namaFasilitas, setNamaFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [layananFasilitas, setLayananFasilitas] = useState("");
  const [fotoHeader, setFotoHeader] = useState<File | null>(null);
  const [fotoLainnya, setFotoLainnya] = useState<File | null>(null);
  const [currentFotoHeader, setCurrentFotoHeader] = useState("");
  const [currentFotoLainnya, setCurrentFotoLainnya] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URL dasar API dari variabel lingkungan
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  /**
   * Fungsi untuk memuat data layanan fasilitas dari API berdasarkan ID
   */
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getLayananFasilitasById(slug as string, id as string);
      if (response.success) {
        const data = response.data;
        setNamaFasilitas(data.nama_fasilitas);
        setDeskripsi(data.deskripsi_overview);
        setLayananFasilitas(data.layanan_fasilitas);
        setCurrentFotoHeader(data.foto_header);
        setCurrentFotoLainnya(data.foto_lainnya);
      } else {
        setError("Gagal memuat data layanan & fasilitas");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data layanan & fasilitas");
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
   * @param {string} type - Jenis file yang diunggah (header/lainnya)
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "header") {
        setFotoHeader(e.target.files[0]);
      } else {
        setFotoLainnya(e.target.files[0]);
      }
    }
  };

  /**
   * Fungsi untuk menangani pengiriman formulir update
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaFasilitas) {
      setError("Nama fasilitas wajib diisi.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Mempersiapkan FormData untuk unggah file
      const formData = new FormData();
      formData.append("nama_fasilitas", namaFasilitas);
      formData.append("deskripsi_overview", deskripsi);
      formData.append("layanan_fasilitas", layananFasilitas);
      
      if (fotoHeader) {
        formData.append("foto_header", fotoHeader);
      }
      
      if (fotoLainnya) {
        formData.append("foto_lainnya", fotoLainnya);
      }
      
      const response = await updateLayananFasilitas(id as string, formData);
      
      if (response.success) {
        router.push("/dashboard/layanan-fasilitas");
      } else {
        setError("Gagal mengupdate layanan & fasilitas");
      }
    } catch (error: any) {
      console.error("Error updating facility:", error);
      setError(
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate layanan & fasilitas"
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
    setFotoHeader(null);
    setFotoLainnya(null);
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
          Edit Layanan & Fasilitas
        </h1>
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

        {/* Upload Foto Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Foto Header Saat Ini (300px x 200px)
            </label>
            <div className="flex-1">
              {currentFotoHeader ? (
                <div className="relative h-48 w-full">
                  <Image 
                    src={`${BASE_URL}/storage/${currentFotoHeader}`} 
                    alt="Foto Header" 
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
          
          <div className="flex items-center mt-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Upload Foto Header Baru
            </label>
            <div className="flex items-center flex-1">
              <label
                htmlFor="fotoHeader"
                className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon path={mdiUpload} size={1} className="mr-2" />
                Browse
              </label>
              <input
                id="fotoHeader"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "header")}
                className="hidden"
                disabled={loading}
              />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {fotoHeader ? fotoHeader.name : "max. 2mb"}
              </span>
            </div>
          </div>
        </div>

        {/* Nama Fasilitas */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaFasilitas"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Fasilitas <span className="text-red-500">*</span>
          </label>
          <input
            id="namaFasilitas"
            type="text"
            value={namaFasilitas}
            onChange={(e) => setNamaFasilitas(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama fasilitas"
            required
            disabled={loading}
          />
        </div>

        {/* Upload Foto Lainnya */}
        <div className="mb-6">
          <div className="flex items-center">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Foto Lainnya Saat Ini
            </label>
            <div className="flex-1">
              {currentFotoLainnya ? (
                <div className="relative h-48 w-full">
                  <Image 
                    src={`${BASE_URL}/storage/${currentFotoLainnya}`} 
                    alt="Foto Lainnya" 
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
          
          <div className="flex items-center mt-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Upload Foto Lainnya Baru
            </label>
            <div className="flex items-center flex-1">
              <label
                htmlFor="fotoLainnya"
                className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon path={mdiUpload} size={1} className="mr-2" />
                Browse
              </label>
              <input
                id="fotoLainnya"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "lainnya")}
                className="hidden"
                disabled={loading}
              />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {fotoLainnya ? fotoLainnya.name : "max. 2mb"}
              </span>
            </div>
          </div>
        </div>

        {/* Deskripsi Overview */}
        <div className="mb-6 flex">
          <label
            htmlFor="deskripsi"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Deskripsi Overview
          </label>
          <textarea
            id="deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={5}
            placeholder="Masukkan deskripsi overview"
            disabled={loading}
          ></textarea>
        </div>

        {/* Layanan Fasilitas */}
        <div className="mb-6 flex">
          <label
            htmlFor="layananFasilitas"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
            Layanan Fasilitas
          </label>
          <textarea
            id="layananFasilitas"
            value={layananFasilitas}
            onChange={(e) => setLayananFasilitas(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={8}
            placeholder="Masukkan layanan fasilitas"
            disabled={loading}
          ></textarea>
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
