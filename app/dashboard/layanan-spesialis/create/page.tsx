"use client";

import { useState } from "react";
import IconPicker from "@/app/components/IconPicker";
import { mdiDelete, mdiPlus, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";

/**
 * Komponen utama untuk halaman Tambah Layanan Spesialis
 * @returns {JSX.Element}
 */
export default function CreateLayananSpesialis() {
  const [namaLayanan, setNamaLayanan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [dokterTerkait, setDokterTerkait] = useState([""]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const dokterOptions = [
    "dr. Bambang Sutoyo, Sp.A",
    "dr. Siti Aminah, Sp.B",
    "dr. Rudi Hartono, Sp.C",
  ];

  /**
   * Fungsi untuk menambah input dokter terkait
   */
  const handleAddDokter = () => {
    setDokterTerkait([...dokterTerkait, ""]);
  };

  /**
   * Fungsi untuk menghapus input dokter terkait
   * @param {number} index - Index dokter yang akan dihapus
   */
  const handleDeleteDokter = (index: number) => {
    const updatedDokter = dokterTerkait.filter((_, i) => i !== index);
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk mereset semua field dokter spesialis
   */
  const handleResetDokter = () => {
    setDokterTerkait([""]);
  };

  /**
   * Fungsi untuk mengubah nilai dokter terkait
   * @param {number} index - Index dokter terkait
   * @param {string} value - Nilai baru
   */
  const handleDokterChange = (index: number, value: string) => {
    const updatedDokter = [...dokterTerkait];
    updatedDokter[index] = value;
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk menangani pengiriman formulir
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaLayanan || !deskripsi || !selectedIcon || dokterTerkait.some((dokter) => !dokter)) {
      setError("Semua field wajib diisi.");
      return;
    }

    // Simulasi pengiriman data
    console.log({
      namaLayanan,
      deskripsi,
      dokterTerkait,
      selectedIcon,
    });

    // Redirect ke halaman layanan spesialis setelah berhasil
    router.push("/dashboard/layanan-spesialis");
  };

  /**
   * Fungsi untuk mereset seluruh formulir
   */
  const handleResetForm = () => {
    setNamaLayanan("");
    setDeskripsi("");
    setDokterTerkait([""]);
    setSelectedIcon("");
    setError("");
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tambah Layanan Spesialis
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

        {/* Pilih Ikon */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Pilih Ikon
          </label>
          <div className="flex-1">
            <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
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
            placeholder="Masukkan deskripsi layanan"
          ></textarea>
        </div>

        {/* Dokter Terkait */}
        {dokterTerkait.map((dokter, index) => (
          <div key={index} className="mb-6 flex items-center">
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
            >
              Dokter Spesialis Terkait {index + 1} <span className="text-red-500">*</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              <select
                value={dokter}
                onChange={(e) => handleDokterChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="" disabled>
                  Pilih Dokter
                </option>
                {dokterOptions.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDokter(index)}
                  className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md"
                >
                  <Icon path={mdiDelete} size={0.8} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={handleResetDokter}
            className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiRestore} size={0.8} className="mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddDokter}
            className="flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add More
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleResetForm}
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
