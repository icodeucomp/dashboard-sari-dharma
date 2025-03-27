"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useRouter } from "next/navigation";

/**
 * Komponen utama untuk halaman Tambah Layanan & Fasilitas
 * @returns {JSX.Element}
 */
export default function CreateLayananFasilitas() {
  const [namaFasilitas, setNamaFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [layananFasilitas, setLayananFasilitas] = useState("");
  const [fotoHeader, setFotoHeader] = useState<File | null>(null);
  const [fotoLainnya, setFotoLainnya] = useState<File | null>(null);
  const [judulFotoLainnya, setJudulFotoLainnya] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaFasilitas || !deskripsi || !layananFasilitas || !fotoHeader) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Simulasi pengiriman data
    console.log({
      namaFasilitas,
      deskripsi,
      layananFasilitas,
      fotoHeader,
      fotoLainnya,
      judulFotoLainnya,
    });

    // Redirect ke halaman layanan fasilitas setelah berhasil
    router.push("/dashboard/layanan-fasilitas");
  };

  /**
   * Fungsi untuk mereset formulir
   */
  const handleReset = () => {
    setNamaFasilitas("");
    setDeskripsi("");
    setLayananFasilitas("");
    setFotoHeader(null);
    setFotoLainnya(null);
    setJudulFotoLainnya("");
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Layanan & Fasilitas
        </h1>
      </div>

      {/* Form Tambah Layanan */}
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
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Upload Foto Header
          </label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="fotoHeader"
              className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer"
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
            />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {fotoHeader ? fotoHeader.name : "max. 5mb"}
            </span>
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
          />
        </div>

        {/* Upload Foto Lainnya dan Judul */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Upload Foto Lainnya
          </label>
          <div className="flex items-center flex-1 gap-4">
            <div className="flex items-center">
              <label
                htmlFor="fotoLainnya"
                className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer"
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
              />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {fotoLainnya ? fotoLainnya.name : "max. 5mb"}
              </span>
            </div>
            <input
              id="judulFotoLainnya"
              type="text"
              value={judulFotoLainnya}
              onChange={(e) => setJudulFotoLainnya(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Judul Foto Lainnya"
            />
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
          ></textarea>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-6 rounded-md"
          >
            Reset
          </button>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
