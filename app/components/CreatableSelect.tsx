"use client";

import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { StylesConfig } from "react-select";

export interface OptionType {
  label: string;
  value: string;
}

interface CategorySelectProps {
  value: string;
  options: OptionType[];
  onChange: (newValue: string) => void;
  onCreateOption: (
    inputValue: string
  ) => Promise<{ success: boolean; newOption?: OptionType }>;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
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

  const customStyles: StylesConfig<OptionType, false> = {
    control: (base) => ({
      ...base,
      minHeight: 42,
    }),
    menu: (base) => ({ ...base, zIndex: 20 }),
  };

  const selectedOption =
    options.find((option) => option.value === value) || null;

  const handleChange = (newValue: OptionType | null) => {
    onChange(newValue?.value || "");
  };

  const handleCreateOption = async (inputValue: string) => {
    try {
      setIsCreating(true);
      const result = await onCreateOption(inputValue);

      if (result.success && result.newOption) {
        onChange(result.newOption.value);
      }
    } catch {
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
