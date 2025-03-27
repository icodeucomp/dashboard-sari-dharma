"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPencil, mdiTrashCan, mdiStethoscope, mdiMagnify } from "@mdi/js";
import Link from "next/link";
import Pagination from "@/app/components/Pagination";

/**
 * Komponen utama untuk halaman Layanan Spesialis
 * @returns {JSX.Element}
 */
export default function LayananSpesialis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data layanan spesialis
  const layananSpesialis = Array(12).fill({
    id: 1,
    title: "Bedah Plastik",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  });

  // Filter data berdasarkan query pencarian
  const filteredItems = layananSpesialis.filter((item) =>
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
            Layanan Spesialis
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
          href="/dashboard/layanan-spesialis/create"
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          + Tambah Baru
        </Link>
      </div>

      {/* Grid layanan spesialis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6">
        {currentItems.map((layanan, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header dengan ikon lingkaran */}
            <div className="flex justify-center items-center py-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Icon path={mdiStethoscope} size={1.5} className="text-orange-600" />
              </div>
            </div>

            {/* Konten layanan */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {layanan.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {layanan.description}
              </p>
              <div className="flex justify-between">
                {/* Tombol Edit */}
                <Link
                  href={`/dashboard/layanan-spesialis/edit/${layanan.id}`}
                  className="flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 text-sm font-medium py-2 px-4 rounded-md"
                >
                  Edit
                  <Icon path={mdiPencil} size={0.8} className="ml-2" />
                </Link>

                {/* Tombol Hapus */}
                <button
                  onClick={() => console.log(`Hapus layanan ${layanan.id}`)}
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
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        showInfo={true}
        activeColor="orange"
      />
    </div>
  );
}
