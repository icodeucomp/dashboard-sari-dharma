"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronRight, mdiHome } from "@mdi/js";

const formatSegmentText = (text: string): string => {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const isSlug = (segment: string): boolean => {
  const commonSegments = [
    'dashboard', 'pasien', 'add', 'schedule', 'antrian', 'doctor', 'service',
    'rekam-medis', 'pemeriksaan', 'resep', 'keuangan', 'pembayaran', 'laporan',
    'pengaturan', 'profile', 'featured-services', 'specialist-services',
    'facility-services', 'doctor-schedules', 'reviews', 'media', 'create', 'edit',
    'health-articles', 'health-packages', 'community-events', 'quality-indicators',
    'career', 'certification-awards', 'doctors', 'categories'
  ];

  return !commonSegments.includes(segment) && /^[a-z0-9-]+$/.test(segment);
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return (
      <div className="flex items-center text-orange-600 dark:text-gray-400 text-sm">
        <Icon path={mdiHome} size={0.8} className="mr-1" />
        <span className="pt-1">Dashboard</span>
      </div>
    );
  }

  const pathSegments = pathname.split('/').filter(segment => segment);

  const pathNames: Record<string, string> = {
    dashboard: 'Dashboard',
    'featured-services': 'Layanan Unggulan',
    'specialist-services': 'Layanan Spesialis',
    'facility-services': 'Layanan & Fasilitas',
    'doctor-schedules': 'Jadwal Dokter',
    media: 'Media & Informasi',
    create: 'Tambah Baru',
    edit: 'Edit',
    'health-articles': 'Artikel Kesehatan',
    'health-packages': 'Paket Kesehatan',
    'community-events': 'Event & Community',
    'quality-indicators': 'Indikator Mutu',
    'doctors': 'Master Dokter',
    'categories': 'Master Kategori',
    careers: 'Karir',
    'social-media-contents': 'Konten Social Media',
    'certification-awards': 'Sertifikasi & Penghargaan',
  };

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

          const segmentText = pathNames[segment] || formatSegmentText(segment);

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
