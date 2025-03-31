"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";

/**
 * Halaman untuk menambahkan Karir baru
 * @returns {JSX.Element}
 */
export default function AddKarir() {
  const [divisi, setDivisi] = useState("");
  const [posisi, setPosisi] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!divisi || !posisi || !linkPendaftaran || !file) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Simulasi pengiriman data
    console.log({
      divisi,
      posisi,
      linkPendaftaran,
      file,
    });

    // Redirect ke halaman Karir setelah berhasil
    router.push("/dashboard/media/karir");
  };

  /**
   * Fungsi untuk mereset formulir
   */
  const handleReset = () => {
    setDivisi("");
    setPosisi("");
    setLinkPendaftaran("");
    setFile(null);
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Karir
        </h1>
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
            htmlFor="file"
            className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Upload Foto <span className="text-red-500">*</span>
          </label>
          <div className="w-3/4 flex items-center gap-4">
            <label
              htmlFor="file"
              className="flex items-center cursor-pointer border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md"
            >
              <Icon path={mdiUpload} size={0.8} className="mr-2" />
              Browse
            </label>
            <input
              id="file"
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            {file && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {file.name}
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
            placeholder="Masukkan link pendaftaran"
          />
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
