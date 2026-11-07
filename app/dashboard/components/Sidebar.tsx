"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import {
  mdiStarOutline,
  mdiStethoscope,
  mdiHospitalBuilding,
  mdiCalendarCheck,
  mdiFolderMultipleOutline,
  mdiAccountTie,
  mdiCertificate,
  mdiChevronDown,
  mdiChevronUp,
  mdiClose,
  mdiMedicalBag,
  mdiNewspaperVariantOutline,
  mdiChartLine,
  mdiBullhornOutline,
  mdiInstagram,
  mdiTagMultiple,
  mdiDoctor,
} from "@mdi/js";
import Logo from "@/app/assets/images/logo.webp";

const NavItem = ({ icon, title, href, isActive, isOpen, subItems = [] }: {
  icon: string;
  title: string;
  href?: string;
  isActive: boolean;
  isOpen: boolean;
  subItems?: { title: string; href: string; icon: string }[];
}) => {
  const pathname = usePathname();

  const hasActiveChild = subItems.some((item) => pathname.startsWith(item.href));

  const [expanded, setExpanded] = useState(hasActiveChild);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (hasActiveChild) {
      setExpanded(true);
    }
  }

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
            ${hasActiveChild
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
          {subItems.map((item, index) => {
            const isSubItemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isSubItemActive
                    ? "bg-white text-[#C75000]"
                    : "text-white hover:bg-[#e05d00]"
                }`}
              >
                <Icon path={item.icon} size={1} className="mr-3" />
                {item.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isOpen, toggleSidebar }: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { title: "Layanan Unggulan", href: "/dashboard/featured-services", icon: mdiStarOutline },
    { title: "Layanan Spesialis", href: "/dashboard/specialist-services", icon: mdiStethoscope },
    { title: "Layanan & Fasilitas", href: "/dashboard/facility-services", icon: mdiHospitalBuilding },
    { title: "Jadwal Dokter", href: "/dashboard/doctor-schedules", icon: mdiCalendarCheck },
    { title: "Master Dokter", href: "/dashboard/doctors", icon: mdiDoctor },
    { title: "Master Kategori", href: "/dashboard/categories", icon: mdiTagMultiple },
    {
      title: "Media & Informasi",
      icon: mdiFolderMultipleOutline,
      subItems: [
        { title: "Paket Kesehatan", href: "/dashboard/media/health-packages", icon: mdiMedicalBag },
        { title: "Artikel Kesehatan", href: "/dashboard/media/health-articles", icon: mdiNewspaperVariantOutline },
        { title: "Event & Community", href: "/dashboard/media/community-events", icon: mdiBullhornOutline },
        { title: "Indikator Mutu", href: "/dashboard/media/quality-indicators", icon: mdiChartLine },
        { title: "Karir", href: "/dashboard/media/careers", icon: mdiAccountTie },
        { title: "Konten Social Media", href: "/dashboard/media/social-media-contents", icon: mdiInstagram },
        { title: "Sertifikasi & Penghargaan", href: "/dashboard/media/certification-awards", icon: mdiCertificate },
      ],
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen transition-all duration-300
        ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
        bg-[#C75000] dark:bg-gray-800 text-white
        flex flex-col
      `}
      style={{ maxHeight: '100vh' }}
    >
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

      <nav className="p-4 flex-1 overflow-y-auto">
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
