"use client";

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

/**
 * Props untuk komponen Modal
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

/**
 * Komponen Modal yang dapat digunakan kembali di seluruh aplikasi
 * @param {ModalProps} props - Props untuk modal
 * @returns {JSX.Element|null} - Komponen modal atau null jika tidak terbuka
 */
const Modal = ({ isOpen, onClose, children, title, size = 'md' }: ModalProps) => {
  // State untuk animasi
  const [isAnimating, setIsAnimating] = useState(false);
  // State untuk mengelola mounting/unmounting dari DOM
  const [isMounted, setIsMounted] = useState(false);
  // State untuk memastikan modal tetap dirender selama transisi
  const [shouldRender, setShouldRender] = useState(false);

  // Ukuran lebar modal berdasarkan prop size
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  /**
   * Memastikan modal hanya di-render di sisi klien
   */
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  /**
   * Menangani animasi dan mengatur overflow body.
   * Saat isOpen true, modal tampil dengan animasi; saat false, modal hilang secara smooth.
   */
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Delay kecil agar transisi masuk terlihat halus
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'auto';
      // Tunggu durasi animasi sebelum menghentikan render modal
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Menangani tombol Escape untuk menutup modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  /**
   * Handler untuk klik overlay (area di luar modal)
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  // Jika belum di-mount atau tidak perlu render, tidak perlu render apapun
  if (!isMounted || !shouldRender) return null;

  // Gunakan createPortal untuk merender modal di luar hirarki DOM komponen induk
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      {/* Overlay tetap dengan opacity 0.2 */}
      <div className="fixed inset-0 bg-black opacity-20 pointer-events-none"></div>
      
      {/* Konten modal; stopPropagation agar klik di dalam tidak menutup modal */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 transform ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Tutup</span>
              <Icon path={mdiClose} size={1} />
            </button>
          </div>
        )}
        
        {/* Konten Modal */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
