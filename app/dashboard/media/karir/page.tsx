"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiMagnify } from "@mdi/js";
import img1 from "@/app/assets/images/media/karir/karir1.png";
import img2 from "@/app/assets/images/media/karir/karir2.png";
import img3 from "@/app/assets/images/media/karir/karir3.png";
import Pagination from "@/app/components/Pagination";

/**
 * Komponen utama untuk halaman Karir
 * @returns {JSX.Element}
 */
export default function Karir() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data karir
  const karirData = [
    { id: 1, title: "Perawat", division: "Divisi Medis", image: img1 },
    { id: 2, title: "Bidan", division: "Divisi Medis", image: img2 },
    { id: 3, title: "Apoteker", division: "Divisi Medis", image: img3 },
    { id: 4, title: "Admin Klinik", division: "Divisi Administrasi dan Operasional", image: img1 },
    { id: 5, title: "Customer Service (CS) Online & Offline", division: "Divisi Administrasi dan Operasional", image: img2 },
    { id: 6, title: "Partnership Manager", division: "Divisi Marketing", image: img3 },
    { id: 7, title: "Dokter Umum", division: "Divisi Medis", image: img1 },
    { id: 8, title: "Marketing Specialist", division: "Divisi Marketing", image: img2 },
    { id: 9, title: "IT Support", division: "Divisi Teknologi", image: img3 },
  ];

  // Filter data berdasarkan query pencarian
  const filteredItems = karirData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mendapatkan data sesuai halaman yang aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Fungsi untuk mengganti halaman
   * @param {number} pageNumber - Nomor halaman yang akan ditampilkan
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Fungsi untuk menangani pencarian
   * @param {React.FormEvent} e - Event form
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman pertama setelah pencarian
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Karir
          </h1>
          <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-r-md"
            >
              <Icon path={mdiMagnify} size={1} />
            </button>
          </form>
        </div>
        <Link
          href="/dashboard/media/karir/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Baru
        </Link>
      </div>

      {/* Grid karir */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
        {currentItems.map((karir) => (
          <div
            key={karir.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
          >
            {/* Gambar karir */}
            <Image
              src={karir.image}
              alt={karir.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />

            {/* Konten karir */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {karir.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {karir.division}
              </p>
              <div className="mt-auto flex justify-between">
                {/* Tombol Edit */}
                <Link
                  href={`/dashboard/media/karir/edit/${karir.id}`}
                  className="flex items-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                >
                  Edit
                  <Icon path={mdiPencil} size={0.8} className="ml-2" />
                </Link>

                {/* Tombol Hapus */}
                <button
                  onClick={() => console.log(`Hapus karir ${karir.id}`)}
                  className="flex cursor-pointer items-center border border-orange-600 text-red-600 hover:bg-orange-600 hover:text-white text-sm font-medium py-2 px-4 rounded-md"
                >
                  Hapus
                  <Icon path={mdiTrashCan} size={0.8} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        showInfo={true}
        activeColor="orange"
      />
    </div>
  );
}
