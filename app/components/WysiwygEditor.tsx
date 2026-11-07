'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export type WysiwygEditorHandle = {
  getContent: () => string;
  setContent: (content: string) => void;
};

interface WysiwygEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const WysiwygEditor = forwardRef<WysiwygEditorHandle, WysiwygEditorProps>(
  ({ value = '', onChange, placeholder = 'Tulis sesuatu...' }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
        quillRef.current = null;
      }

      if (editorRef.current) {
        const oldToolbar = editorRef.current.parentElement?.querySelector('.ql-toolbar');
        if (oldToolbar) {
          oldToolbar.remove();
        }

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

        if (value) {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }

        quillRef.current.on('text-change', () => {
          if (onChange && quillRef.current) {
            onChange(quillRef.current.root.innerHTML);
          }
        });
      }

      return () => {
        if (quillRef.current) {
          quillRef.current.off('text-change');
          // @ts-expect-error - Quill has a destroy method that is missing from its types
          if (typeof quillRef.current.destroy === 'function') {
            if (quillRef.current && editorRef.current) {
              quillRef.current.off('text-change');
              editorRef.current.innerHTML = '';
            }
          }
          quillRef.current = null;
        }
      };
    }, [placeholder]);

    useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        if (quillRef.current) {
          return quillRef.current.root.innerHTML;
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