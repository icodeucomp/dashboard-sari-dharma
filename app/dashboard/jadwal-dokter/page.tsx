"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter } from "@mdi/js";
import imgCard from "@/app/assets/images/jadwal_dokter/column.png";
import Pagination from "@/app/components/Pagination";

/**
 * Komponen utama untuk halaman Jadwal Dokter
 * @returns {JSX.Element}
 */
export default function JadwalDokter() {
  // Data jadwal dokter
  const jadwalDokter = Array(12).fill({
    id: 1,
    name: "dr. Bambang Sutoyo, Sp.A",
    specialization: "Heart transplantation",
    description:
      "Arrhythmia, Adult congenital heart disease, Congenital heart disease, Common pediatric heart disease",
  });

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mendapatkan data sesuai halaman yang aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jadwalDokter.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Fungsi untuk mengganti halaman
   * @param {number} pageNumber - Nomor halaman yang akan ditampilkan
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Jadwal Dokter
        </h1>
        <div className="flex gap-4">
          {/* Tombol Filter */}
          <button
            className="flex cursor-pointer items-center border border-orange-600 hover:border-orange-700 hover:text-orange-700 text-orange-600 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md"
          >
            <Icon path={mdiFilter} size={1} className="mr-2" />
            Filters
          </button>
          {/* Tombol Tambah Baru */}
          <Link
            href="/dashboard/jadwal-dokter/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Add New
          </Link>
        </div>
      </div>

      {/* Grid jadwal dokter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
        {currentItems.map((dokter, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Gambar dokter */}
            <Image
              src={imgCard}
              alt={dokter.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />

            {/* Konten dokter */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {dokter.name}
              </h2>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-2">
                {dokter.specialization}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {dokter.description}
              </p>
              <div className="flex justify-between">
                {/* Tombol Edit */}
                <Link
                  href={`/dashboard/jadwal-dokter/edit/${dokter.id}`}
                  className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                >
                  Edit
                  <Icon path={mdiPencil} size={0.8} className="ml-2" />
                </Link>

                {/* Tombol Hapus */}
                <button
                  onClick={() => console.log(`Hapus jadwal dokter ${dokter.id}`)}
                  className="flex cursor-pointer items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium py-2 px-4 rounded-md"
                >
                  Delete
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
        totalItems={jadwalDokter.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        showInfo={true}
        activeColor="orange"
      />
    </div>
  );
}
