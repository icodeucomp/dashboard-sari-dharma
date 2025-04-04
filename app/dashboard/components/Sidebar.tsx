"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiViewDashboard,
  mdiStarOutline,
  mdiStethoscope,
  mdiHospitalBuilding,
  mdiCalendarCheck,
  mdiCommentTextOutline,
  mdiFolderMultipleOutline,
  mdiFileDocumentOutline,
  mdiAccountTie,
  mdiClipboardTextOutline,
  mdiCertificate,
  mdiChevronDown,
  mdiChevronUp,
  mdiClose,
} from "@mdi/js";
import Logo from "@/app/assets/images/logo.webp";

/**
 * Komponen item navigasi untuk sidebar
 * @param {string} icon - Path ikon dari MDI
 * @param {string} title - Judul menu
 * @param {string} href - URL tujuan
 * @param {boolean} isActive - Status aktif menu
 * @param {boolean} isOpen - Status sidebar terbuka/tertutup
 * @param {Array} subItems - Item sub menu
 * @returns {JSX.Element}
 */
const NavItem = ({ icon, title, href, isActive, isOpen, subItems = [] }: {
  icon: string;
  title: string;
  href?: string;
  isActive: boolean;
  isOpen: boolean;
  subItems?: { title: string; href: string; icon: string }[];
}) => {
  const pathname = usePathname();

  // Cek apakah ada subitem yang aktif
  const hasActiveChild = subItems.some((item) => pathname === item.href);

  // State untuk mengatur apakah submenu terbuka
  const [expanded, setExpanded] = useState(hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true); // Buka submenu jika ada subitem aktif
    }
  }, [hasActiveChild]);

  return (
    <div className="mb-1">
      {href ? (
        <Link
          href={href}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${isActive
              ? "bg-white text-[#C75000]"
              : "text-white hover:bg-[#e05d00]"
            }
            ${!isOpen && 'justify-center'}`}
        >
          <Icon path={icon} size={1} className={!isOpen ? 'mx-auto' : 'mr-3'} />
          {isOpen && <span>{title}</span>}
        </Link>
      ) : (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
            ${hasActiveChild || expanded
              ? "bg-[#e05d00] text-white"
              : "text-white hover:bg-[#e05d00]"
            }
            ${!isOpen && 'justify-center'}`}
        >
          <div className="flex items-center">
            <Icon path={icon} size={1} className={!isOpen ? 'mx-auto' : 'mr-3'} />
            {isOpen && <span>{title}</span>}
          </div>
          {isOpen && (
            <Icon path={expanded ? mdiChevronUp : mdiChevronDown} size={0.8} />
          )}
        </button>
      )}

      {isOpen && expanded && subItems.length > 0 && (
        <div className="ml-4 mt-1">
          {subItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-white text-[#C75000]"
                  : "text-white hover:bg-[#e05d00]"
              }`}
            >
              <Icon path={item.icon} size={1} className="mr-3" />
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Komponen sidebar utama
 * @param {boolean} isOpen - Status sidebar terbuka/tertutup
 * @param {Function} toggleSidebar - Fungsi untuk toggle sidebar
 * @returns {JSX.Element}
 */
export default function Sidebar({ isOpen, toggleSidebar }: { 
  isOpen: boolean; 
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();

  // Daftar menu navigasi
  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: mdiViewDashboard },
    { title: "Layanan Unggulan", href: "/dashboard/layanan-unggulan", icon: mdiStarOutline },
    { title: "Layanan Spesialis", href: "/dashboard/layanan-spesialis", icon: mdiStethoscope },
    { title: "Layanan & Fasilitas", href: "/dashboard/layanan-fasilitas", icon: mdiHospitalBuilding },
    { title: "Jadwal Dokter", href: "/dashboard/jadwal-dokter", icon: mdiCalendarCheck },
    { title: "Reviews", href: "/dashboard/reviews", icon: mdiCommentTextOutline },
    {
      title: "Media & Informasi",
      icon: mdiFolderMultipleOutline,
      subItems: [
        { title: "Paket Kesehatan", href: "/dashboard/media/paket-kesehatan", icon: mdiFileDocumentOutline },
        { title: "Artikel Kesehatan", href: "/dashboard/media/artikel-kesehatan", icon: mdiFileDocumentOutline },
        { title: "Event & Community", href: "/dashboard/media/event-community", icon: mdiFileDocumentOutline },
        { title: "Indikator Mutu", href: "/dashboard/media/indikator-mutu", icon: mdiClipboardTextOutline },
        { title: "Karir", href: "/dashboard/media/karir", icon: mdiAccountTie },
        { title: "Form Management", href: "/dashboard/media/form-management", icon: mdiFileDocumentOutline },
        { title: "Konten Social Media", href: "/dashboard/media/konten-social-media", icon: mdiFileDocumentOutline },
        { title: "Sertifikasi & Penghargaan", href: "/dashboard/media/sertifikasi-penghargaan", icon: mdiCertificate },
      ],
    },
  ];

  return (
    <aside 
      className={`
        fixed left-0 top-0 z-40 min-h-screen transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'} 
        bg-[#C75000] dark:bg-gray-800 text-white overflow-y-auto
      `}
    >
      {/* Header dengan Logo */}
      <div className={`flex items-center justify-between h-16 px-4`}>
        <div className={`flex items-center justify-center w-full`}>
          <Image
            src={Logo}
            alt="Klinik Sari Dharma"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        
        {/* Tombol tutup untuk mode mobile */}
        {isOpen && (
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-white hover:text-gray-200 p-1"
            aria-label="Tutup Sidebar"
          >
            <Icon path={mdiClose} size={1} />
          </button>
        )}
      </div>

      {/* Menu Navigasi */}
      <nav className="p-4">
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            title={item.title}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href}
            isOpen={isOpen}
            subItems={item.subItems || []}
          />
        ))}
      </nav>
    </aside>
  );
}
