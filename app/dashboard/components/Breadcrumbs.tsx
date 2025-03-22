"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiHome } from "@mdi/js";

/**
 * Fungsi untuk mengubah format teks dari slug URL menjadi teks yang mudah dibaca
 * @param {string} text - Teks slug URL (contoh: 'layanan-unggulan')
 * @returns {string} - Teks yang sudah diformat (contoh: 'Layanan Unggulan')
 */
const formatSegmentText = (text: string): string => {
  // Pisahkan teks berdasarkan tanda hubung dan buat kapitalisasi awal kata
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip if we're on the main dashboard page
  if (pathname === "/dashboard") {
    return (
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
        <Icon path={mdiHome} size={0.8} className="mr-1" />
        <span>Dashboard</span>
      </div>
    );
  }
  
  // Create breadcrumb items
  const pathSegments = pathname.split('/').filter(segment => segment);
  
  // Map path segments to readable names
  const pathNames: Record<string, string> = {
    dashboard: 'Dashboard',
    pasien: 'Pasien',
    tambah: 'Tambah Pasien',
    jadwal: 'Jadwal & Antrian',
    antrian: 'Antrian Hari Ini',
    dokter: 'Jadwal Dokter',
    layanan: 'Layanan Medis',
    'rekam-medis': 'Rekam Medis',
    pemeriksaan: 'Pemeriksaan',
    resep: 'Resep Obat',
    keuangan: 'Keuangan',
    pembayaran: 'Pembayaran',
    laporan: 'Laporan',
    pengaturan: 'Pengaturan',
    profile: 'Profil',
    'layanan-unggulan': 'Layanan Unggulan',
    'layanan-spesialis': 'Layanan Spesialis',
    'layanan-fasilitas': 'Layanan & Fasilitas',
    'jadwal-dokter': 'Jadwal Dokter',
    reviews: 'Reviews',
    media: 'Media & Informasi',
    create: 'Tambah Baru',
    edit: 'Edit',
  };

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
            <Icon path={mdiHome} size={0.8} className="mr-1" />
            <span>Dashboard</span>
          </Link>
        </li>
        
        {pathSegments.slice(1).map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 2).join('/')}`;
          const isLast = index === pathSegments.slice(1).length - 1;
          
          // Gunakan nama yang sudah dipetakan atau format teks dari URL
          const segmentText = pathNames[segment] || formatSegmentText(segment);
          
          return (
            <li key={path} className="flex items-center">
              <Icon path={mdiChevronRight} size={0.8} className="mx-2 text-gray-500 dark:text-gray-400" />
              
              {isLast ? (
                <span className="text-gray-700 dark:text-gray-300">
                  {segmentText}
                </span>
              ) : (
                <Link 
                  href={path} 
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {segmentText}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
