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

/**
 * Fungsi untuk memeriksa apakah sebuah segment adalah slug (memiliki pola yang tidak standar)
 * @param {string} segment - Segment path yang akan diperiksa
 * @returns {boolean} - Hasil pemeriksaan apakah segment merupakan slug
 */
const isSlug = (segment: string): boolean => {
  // Slug biasanya memiliki banyak karakter huruf kecil dan angka dengan tanda hubung
  // dan tidak terdaftar dalam pathNames
  const commonSegments = [
    'dashboard', 'pasien', 'tambah', 'jadwal', 'antrian', 'dokter', 'layanan',
    'rekam-medis', 'pemeriksaan', 'resep', 'keuangan', 'pembayaran', 'laporan',
    'pengaturan', 'profile', 'layanan-unggulan', 'layanan-spesialis', 
    'layanan-fasilitas', 'jadwal-dokter', 'reviews', 'media', 'create', 'edit',
    'artikel-kesehatan', 'paket-kesehatan', 'event-community', 'indikator-mutu',
    'karir', 'sertifikasi-penghargaan'
  ];
  
  return !commonSegments.includes(segment) && /^[a-z0-9-]+$/.test(segment);
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip if we're on the main dashboard page
  if (pathname === "/dashboard") {
    return (
      <div className="flex items-center text-orange-600 dark:text-gray-400 text-sm">
        <Icon path={mdiHome} size={0.8} className="mr-1" />
        <span className="pt-1">Dashboard</span>
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
    'artikel-kesehatan': 'Artikel Kesehatan',
    'paket-kesehatan': 'Paket Kesehatan',
    'event-community': 'Event & Community',
    'indikator-mutu': 'Indikator Mutu',
    karir: 'Karir',
    // Sertifikasi Penghargaan
    'sertifikasi-penghargaan': 'Sertifikasi & Penghargaan',
  };

  // Segment yang akan ditampilkan sebagai teks biasa (bukan link)
  const disabledLinkSegments = ['media', 'create', 'edit'];

  return (
    <nav className="flex items-center text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/dashboard" className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 flex items-center">
            <Icon path={mdiHome} size={0.8} className="mr-1" />
            <span className="flex items-center pt-1">Dashboard</span>
          </Link>
        </li>
        
        {pathSegments.slice(1).map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 2).join('/')}`;
          const isLast = index === pathSegments.slice(1).length - 1;
          
          // Gunakan nama yang sudah dipetakan atau format teks dari URL
          const segmentText = pathNames[segment] || formatSegmentText(segment);
          
          // Cek apakah segment ini adalah slug atau segment yang dijadikan teks biasa
          const isDisabledLink = isLast || disabledLinkSegments.includes(segment) || isSlug(segment);
          
          return (
            <li key={path} className="flex items-center pt-1">
              <Icon path={mdiChevronRight} size={0.8} className="mx-2 text-gray-500 dark:text-gray-400" />
              
              {isDisabledLink ? (
                <span className="text-gray-700 dark:text-gray-300 flex items-center">
                  {segmentText}
                </span>
              ) : (
                <Link 
                  href={path} 
                  className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 flex items-center"
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
