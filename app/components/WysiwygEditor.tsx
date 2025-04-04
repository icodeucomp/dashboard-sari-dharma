'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

/**
 * Tipe untuk handle WysiwygEditor
 * @interface WysiwygEditorHandle
 * @property {Function} getContent - Mengambil konten dari editor
 * @property {Function} setContent - Mengatur konten editor
 */
export type WysiwygEditorHandle = {
  getContent: () => string;
  setContent: (content: string) => void;
};

/**
 * Props untuk komponen WysiwygEditor
 * @interface WysiwygEditorProps
 * @property {string} value - Nilai konten editor
 * @property {Function} onChange - Fungsi yang dipanggil ketika konten berubah
 * @property {string} placeholder - Teks placeholder untuk editor
 */
interface WysiwygEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

/**
 * Komponen editor teks WYSIWYG menggunakan Quill
 * @param {WysiwygEditorProps} props - Props untuk editor
 * @param {React.Ref<WysiwygEditorHandle>} ref - Ref untuk mengakses fungsi editor
 * @returns {JSX.Element}
 */
const WysiwygEditor = forwardRef<WysiwygEditorHandle, WysiwygEditorProps>(
  ({ value = '', onChange, placeholder = 'Tulis sesuatu...' }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    // Inisialisasi Quill editor
    useEffect(() => {
      // Bersihkan instance yang mungkin ada
      if (quillRef.current) {
        quillRef.current.off('text-change');
        // Bersihkan referensi Quill tanpa memanggil metode destroy
        quillRef.current = null;
        quillRef.current = null;
      }

      // Pastikan DOM element ada sebelum inisialisasi
      if (editorRef.current) {
        // Hapus toolbar yang mungkin sudah ada
        const oldToolbar = editorRef.current.parentElement?.querySelector('.ql-toolbar');
        if (oldToolbar) {
          oldToolbar.remove();
        }

        // Inisialisasi Quill baru
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          },
          placeholder: placeholder,
        });

        // Atur konten awal
        if (value) {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }

        // Tambahkan event listener untuk perubahan konten
        quillRef.current.on('text-change', () => {
          if (onChange && quillRef.current) {
            onChange(quillRef.current.root.innerHTML);
          }
        });
      }

      return () => {
        // Hapus instance Quill saat komponen di-unmount
        if (quillRef.current) {
          quillRef.current.off('text-change');
          // @ts-expect-error - Quill memiliki metode destroy tapi tidak didefinisikan dalam tipe
          if (typeof quillRef.current.destroy === 'function') {
            if (quillRef.current && editorRef.current) {
              quillRef.current.off('text-change');
              // eslint-disable-next-line react-hooks/exhaustive-deps
              editorRef.current.innerHTML = ''; // Clear the editor's DOM
            }
          }
          quillRef.current = null;
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [placeholder]);

    // Update konten editor ketika value prop berubah
    useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }, [value]);

    // Ekspos fungsi ke komponen induk
    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML; // Kembalikan konten HTML
        }
        return '';
      },
      setContent: (content: string) => {
        if (quillRef.current) {
          quillRef.current.clipboard.dangerouslyPasteHTML(content);
        }
      },
    }));

    return (
      <div className="rich-text-editor">
        <div ref={editorRef} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-white" style={{ height: '300px', marginBottom: '50px' }} />
      </div>
    );
  }
);

WysiwygEditor.displayName = 'WysiwygEditor';
export default WysiwygEditor;