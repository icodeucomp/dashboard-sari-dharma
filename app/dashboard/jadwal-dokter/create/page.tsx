"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiUpload } from "@mdi/js";
import Link from "next/link";
import "moment/locale/id";

/**
 * Halaman untuk menambahkan jadwal dokter baru
 * @returns {JSX.Element}
 */
export default function AddJadwalDokter() {
  // State untuk jadwal dokter
  const [jadwal, setJadwal] = useState([{ hari: "", jamMulai: "", jamSelesai: "" }]);

  // State untuk edukasi/karir
  const [edukasiKarir, setEdukasiKarir] = useState([{ edukasi: "", tahunMulai: "", tahunSelesai: "" }]);

  /**
   * Fungsi untuk menambahkan jadwal baru
   */
  const handleAddJadwal = () => {
    setJadwal([...jadwal, { hari: "", jamMulai: "", jamSelesai: "" }]);
  };

  /**
   * Fungsi untuk menghapus jadwal
   * @param {number} index - Index jadwal yang akan dihapus
   */
  const handleDeleteJadwal = (index: number) => {
    setJadwal(jadwal.filter((_, i) => i !== index));
  };

  /**
   * Fungsi untuk mengubah data jadwal
   * @param {number} index - Index jadwal yang diubah
   * @param {"hari" | "jamMulai" | "jamSelesai"} field - Field yang diubah
   * @param {string} value - Nilai baru
   */
  const handleChangeJadwal = (
    index: number,
    field: "hari" | "jamMulai" | "jamSelesai",
    value: string
  ) => {
    const updatedJadwal = [...jadwal];
    updatedJadwal[index][field] = value;
    setJadwal(updatedJadwal);
  };

  /**
   * Fungsi untuk menambahkan edukasi/karir baru
   */
  const handleAddEdukasiKarir = () => {
    setEdukasiKarir([...edukasiKarir, { edukasi: "", tahunMulai: "", tahunSelesai: "" }]);
  };

  /**
   * Fungsi untuk menghapus edukasi/karir
   * @param {number} index - Index edukasi/karir yang akan dihapus
   */
  const handleDeleteEdukasiKarir = (index: number) => {
    setEdukasiKarir(edukasiKarir.filter((_, i) => i !== index));
  };

  /**
   * Fungsi untuk mengubah data edukasi/karir
   * @param {number} index - Index edukasi/karir yang diubah
   * @param {"edukasi" | "tahunMulai" | "tahunSelesai"} field - Field yang diubah
   * @param {string} value - Nilai baru
   */
  const handleChangeEdukasiKarir = (
    index: number,
    field: "edukasi" | "tahunMulai" | "tahunSelesai",
    value: string
  ) => {
    const updatedEdukasiKarir = [...edukasiKarir];
    updatedEdukasiKarir[index][field] = value;
    setEdukasiKarir(updatedEdukasiKarir);
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleResetForm = () => {
    setJadwal([{ hari: "", jamMulai: "", jamSelesai: "" }]);
    setEdukasiKarir([{ edukasi: "", tahunMulai: "", tahunSelesai: "" }]);
    // Tambahkan reset untuk input lain jika diperlukan
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Jadwal Dokter
        </h1>
        <Link
          href="/dashboard/jadwal-dokter"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Back
        </Link>
      </div>

      {/* Form tambah jadwal dokter */}
      <form className="space-y-6">
        {/* Upload Foto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Foto
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </button>
            <span className="text-sm text-gray-500">max. 5mb</span>
          </div>
        </div>

        {/* Nama Dokter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Dokter *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
            placeholder="Masukkan nama dokter"
          />
        </div>

        {/* Spesialis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Spesialis *
          </label>
          <select
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
          >
            <option value="">Pilih spesialis</option>
            <option value="Heart Transplantation">Heart Transplantation</option>
            <option value="Bedah Plastik">Bedah Plastik</option>
            {/* Tambahkan opsi lainnya */}
          </select>
        </div>

        {/* Background Dokter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Dokter *
          </label>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
            rows={4}
            placeholder="Masukkan background dokter"
          ></textarea>
        </div>

        {/* Jadwal Dokter */}
        <div>
          <label className="block text-xl font-bold text-orange-600 dark:text-gray-300 mb-2">
            Jadwal Dokter
          </label>
          {jadwal.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <select
                value={item.hari}
                onChange={(e) => handleChangeJadwal(index, "hari", e.target.value)}
                className="w-1/4 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
              >
                <option value="">Hari</option>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                {/* Tambahkan hari lainnya */}
              </select>
              <input
                type="time"
                value={item.jamMulai}
                onChange={(e) => handleChangeJadwal(index, "jamMulai", e.target.value)}
                className="w-1/4 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
              />
              <input
                type="time"
                value={item.jamSelesai}
                onChange={(e) => handleChangeJadwal(index, "jamSelesai", e.target.value)}
                className="w-1/4 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => handleDeleteJadwal(index)}
                className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md"
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddJadwal}
            className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md"
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add Hari
          </button>
        </div>

        {/* Section Edukasi / Karir */}
        <div>
          <label className="block text-xl font-bold text-orange-600 dark:text-gray-300 mb-2">
            Edukasi / Karir
          </label>
          {edukasiKarir.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={item.edukasi}
                onChange={(e) => handleChangeEdukasiKarir(index, "edukasi", e.target.value)}
                className="w-1/2 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
                placeholder="Edukasi / Karir"
              />
              <input
                type="number"
                value={item.tahunMulai}
                onChange={(e) => handleChangeEdukasiKarir(index, "tahunMulai", e.target.value)}
                className="w-1/4 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
                placeholder="Tahun Mulai"
              />
              <input
                type="number"
                value={item.tahunSelesai}
                onChange={(e) => handleChangeEdukasiKarir(index, "tahunSelesai", e.target.value)}
                className="w-1/4 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-gray-700 dark:text-white"
                placeholder="Tahun Selesai"
              />
              <button
                type="button"
                onClick={() => handleDeleteEdukasiKarir(index)}
                className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md"
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEdukasiKarir}
            className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md"
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add New
          </button>
        </div>

        {/* Tombol Simpan dan Reset */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleResetForm}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium py-2 px-6 rounded-md"
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
