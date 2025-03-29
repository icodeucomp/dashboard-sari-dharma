"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import Link from "next/link";

/**
 * Halaman untuk menambahkan Paket Kesehatan baru
 * @returns {JSX.Element}
 */
export default function AddPaketKesehatan() {
  // State untuk form
  const [kategori, setKategori] = useState("");
  const [promo, setPromo] = useState(false);
  const [berlakuSampai, setBerlakuSampai] = useState("");
  const [namaPaket, setNamaPaket] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  /**
   * Fungsi untuk menangani unggahan file
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleResetForm = () => {
    setKategori("");
    setPromo(false);
    setBerlakuSampai("");
    setNamaPaket("");
    setDeskripsi("");
    setFoto(null);
  };

  /**
   * Fungsi untuk menangani pengiriman form
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      kategori,
      promo,
      berlakuSampai,
      namaPaket,
      deskripsi,
      foto,
    });
    // Tambahkan logika pengiriman data di sini
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Add New Paket Kesehatan
        </h1>
        <Link
          href="/dashboard/media/paket-kesehatan"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Back
        </Link>
      </div>

      {/* Form Tambah Paket Kesehatan */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Upload Foto */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Upload Foto
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
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
              {foto ? foto.name : "max. 5mb"}
            </span>
          </div>
        </div>

        {/* Kategori */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="kategori"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            id="kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Pilih Kategori</option>
            <option value="General Check Up">General Check Up</option>
            <option value="Medical Check Up">Medical Check Up</option>
          </select>
        </div>

        {/* Promo */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Promo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="yes"
                checked={promo === true}
                onChange={() => setPromo(true)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="promo"
                value="no"
                checked={promo === false}
                onChange={() => setPromo(false)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Berlaku Sampai */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="berlakuSampai"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Berlaku Sampai
          </label>
          <input
            id="berlakuSampai"
            type="date"
            value={berlakuSampai}
            onChange={(e) => setBerlakuSampai(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Nama Paket */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaPaket"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Paket <span className="text-red-500">*</span>
          </label>
          <input
            id="namaPaket"
            type="text"
            value={namaPaket}
            onChange={(e) => setNamaPaket(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama paket"
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
            placeholder="Masukkan deskripsi paket"
          ></textarea>
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
