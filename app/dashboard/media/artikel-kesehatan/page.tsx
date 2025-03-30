"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiFilter, mdiMagnify, mdiTag, mdiCalendar } from "@mdi/js";
import imgCard from "@/app/assets/images/media/artikel-kesehatan/column.png";
import Pagination from "@/app/components/Pagination";

/**
 * Komponen utama untuk halaman Artikel Kesehatan
 * @returns {JSX.Element}
 */
export default function ArtikelKesehatan() {
  // Data artikel kesehatan
  const artikelKesehatan = Array(12).fill({
    id: 1,
    title: "Peresmian Gedung Baru dengan Fasilitas Rawat Inap Modern",
    category: "Edukasi Kesehatan",
    date: "22 January 2024",
  });

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // State untuk input pencarian
  const [searchQuery, setSearchQuery] = useState("");

  // Mendapatkan data sesuai halaman yang aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = artikelKesehatan.slice(indexOfFirstItem, indexOfLastItem);

  /**
   * Fungsi untuk mengganti halaman
   * @param {number} pageNumber - Nomor halaman yang akan ditampilkan
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /**
   * Fungsi untuk menangani submit pencarian
   * @param {React.FormEvent<HTMLFormElement>} event - Event submit form
   */
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Search query:", searchQuery);
    // Tambahkan logika pencarian di sini
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Artikel Kesehatan
          </h1>
          {/* Search Box */}
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
            href="/dashboard/media/artikel-kesehatan/create"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            + Add New
          </Link>
        </div>
      </div>

      {/* Grid artikel kesehatan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 3xl:grid-cols-6 gap-6">
        {currentItems.map((artikel, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {/* Gambar artikel */}
            <Image
              src={imgCard}
              alt={artikel.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />

            {/* Kategori */}
            <div className="px-4 py-2 mt-4">
              <div className="inline-flex items-center gap-2 bg-[#FB973B] text-white text-sm font-medium px-3 py-1 rounded-md">
                <Icon path={mdiTag} size={0.8} />
                {artikel.category}
              </div>
            </div>

            {/* Konten artikel */}
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Icon path={mdiCalendar} size={0.8} className="mr-2" />
                {artikel.date}
              </div>
              <h2 className="text-sm md:text-md lg:text-lg leading-[25px] font-semibold text-gray-800 dark:text-white mb-4">
                {artikel.title}
              </h2>
              <div className="flex justify-between">
                {/* Tombol Edit */}
                <Link
                  href={`/dashboard/media/artikel-kesehatan/edit/${artikel.id}`}
                  className="flex items-center bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                >
                  Edit
                  <Icon path={mdiPencil} size={0.8} className="ml-2" />
                </Link>

                {/* Tombol Hapus */}
                <button
                  onClick={() => console.log(`Hapus artikel ${artikel.id}`)}
                  className="flex cursor-pointer items-center border border-orange-600 text-red-600 hover:bg-orange-600 hover:text-white text-sm font-medium py-2 px-4 rounded-md"
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
        totalItems={artikelKesehatan.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        showInfo={true}
        activeColor="orange"
      />
    </div>
  );
}
