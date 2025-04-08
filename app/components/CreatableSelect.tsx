"use client";

import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, StylesConfig } from 'react-select';

/**
 * Interface untuk opsi dalam dropdown
 */
export interface OptionType {
  label: string;
  value: string;
}

/**
 * Props untuk KategoriSelect
 */
interface KategoriSelectProps {
  value: string;
  options: OptionType[];
  onChange: (newValue: string) => void;
  onCreateOption: (inputValue: string) => Promise<{ success: boolean; newOption?: OptionType }>;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

/**
 * Komponen dropdown yang mendukung pencarian dan pembuatan opsi baru
 */
export const KategoriSelect: React.FC<KategoriSelectProps> = ({
  value,
  options,
  onChange,
  onCreateOption,
  placeholder = "Pilih atau ketik untuk membuat baru...",
  isLoading = false,
  isDisabled = false,
  className = "",
}) => {
  const [isCreating, setIsCreating] = useState(false);

  // Styles untuk react-select
  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#f97316' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #f97316' : 'none',
      '&:hover': {
        borderColor: '#f97316',
      },
      borderRadius: '0.375rem',
      padding: '0.25rem',
      backgroundColor: isDisabled ? '#f3f4f6' : 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#f97316'
        : state.isFocused 
          ? '#ffedd5' 
          : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: state.isSelected ? '#f97316' : '#ffedd5',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1f2937',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
    }),
  };

  /**
   * Menemukan opsi yang dipilih berdasarkan value
   */
  const selectedOption = options.find(option => option.value === value) || null;

  /**
   * Menangani perubahan pada Select
   * @param newValue - Nilai yang dipilih
   * @param actionMeta - Metadata tindakan
   */
  const handleChange = (
    newValue: OptionType | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    onChange(newValue?.value || "");
  };

  /**
   * Menangani pembuatan opsi baru
   * @param inputValue - Nilai yang diketik pengguna
   */
  const handleCreateOption = async (inputValue: string) => {
    try {
      setIsCreating(true);
      const result = await onCreateOption(inputValue);
      
      if (result.success && result.newOption) {
        onChange(result.newOption.value);
      }
    } catch (error) {
      console.error("Error creating new option:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isDisabled || isCreating}
      isLoading={isLoading || isCreating}
      onChange={handleChange}
      onCreateOption={handleCreateOption}
      options={options}
      value={selectedOption}
      placeholder={placeholder}
      classNamePrefix="select"
      className={className}
      styles={customStyles}
      formatCreateLabel={(inputValue) => `Buat kategori baru "${inputValue}"`}
      noOptionsMessage={() => "Tidak ada kategori yang ditemukan"}
      loadingMessage={() => "Memuat data..."}
    />
  );
};
