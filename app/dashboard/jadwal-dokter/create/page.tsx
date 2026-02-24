"use client";

import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiUpload } from "@mdi/js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "moment/locale/id";
import { createJadwalDokter, getDokterList, getSpesialisList, Dokter, Spesialis } from "@/app/services/jadwalDokterService";
import AsyncSelect from "react-select/async";

/**
 * Halaman untuk menambahkan jadwal dokter baru
 * @returns {JSX.Element}
 */
export default function AddJadwalDokter() {
  const router = useRouter();

  // State untuk form
  // State untuk react-select dokter dan spesialis
  const [selectedDokter, setSelectedDokter] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [selectedSpesialis, setSelectedSpesialis] = useState<{ value: string; label: string }>({ value: "", label: "" });
  /**
   * Fungsi untuk load data dokter secara async untuk react-select
   * @param {string} inputValue - input pencarian
   * @returns {Promise<{value: string, label: string}[]>}
   */
  const loadDokterOptions = async (inputValue: string) => {
    try {
      const res = await getDokterList(inputValue.toLowerCase());
      if (res.success && Array.isArray(res.data)) {
        return res.data.map((dokter) => ({
          value: dokter.id,
          label: dokter.nama_dokter,
        }));
      }
      return [];
    } catch {
      return [];
    }
  };

  /**
   * Fungsi untuk load data spesialis secara async untuk react-select
   * @param {string} inputValue - input pencarian
   * @returns {Promise<{value: string, label: string}[]>}
   */
  const loadSpesialisOptions = async (inputValue: string) => {
    try {
      const res = await getSpesialisList();
      if (res.success && Array.isArray(res.data)) {
        return res.data
          .filter((spesialis) => spesialis.nama_layanan.toLowerCase().includes(inputValue.toLowerCase()))
          .map((spesialis) => ({
            value: spesialis.id,
            label: spesialis.nama_layanan,
          }));
      }
      return [];
    } catch {
      return [];
    }
  };
  const [backgroundDokter, setBackgroundDokter] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [jadwal, setJadwal] = useState([{ hari: "", jam_mulai: "", jam_selesai: "" }]);
  const [edukasiKarir, setEdukasiKarir] = useState([{ judul: "", tahun_mulai: "", tahun_selesai: "" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk data dropdown
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [spesialisList, setSpesialisList] = useState<Spesialis[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);

  /**
   * Fungsi untuk memuat data dokter dan spesialis untuk dropdown
   */
  const fetchDropdownData = async () => {
    try {
      setLoadingDropdown(true);

      const [dokterResponse, spesialisResponse] = await Promise.all([getDokterList(), getSpesialisList()]);

      if (dokterResponse.success) {
        // Pastikan data yang diterima adalah array
        if (Array.isArray(dokterResponse.data)) {
          setDokterList(dokterResponse.data);
        } else {
          console.error("Data dokter bukan array:", dokterResponse.data);
          setDokterList([]);
        }
      } else {
        setDokterList([]);
      }

      if (spesialisResponse.success) {
        // Pastikan data yang diterima adalah array
        if (Array.isArray(spesialisResponse.data)) {
          setSpesialisList(spesialisResponse.data);
        } else {
          console.error("Data spesialis bukan array:", spesialisResponse.data);
          setSpesialisList([]);
        }
      } else {
        setSpesialisList([]);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setError("Gagal memuat data dokter dan spesialis");
      setDokterList([]);
      setSpesialisList([]);
    } finally {
      setLoadingDropdown(false);
    }
  };

  /**
   * Memuat data dropdown saat komponen dimount
   */
  useEffect(() => {
    fetchDropdownData();
  }, []);

  /**
   * Fungsi untuk menambahkan jadwal baru
   */
  const handleAddJadwal = () => {
    setJadwal([...jadwal, { hari: "", jam_mulai: "", jam_selesai: "" }]);
  };

  /**
   * Fungsi untuk menghapus jadwal
   * @param {number} index - Index jadwal yang akan dihapus
   */
  const handleDeleteJadwal = (index: number) => {
    if (jadwal.length > 1) {
      setJadwal(jadwal.filter((_, i) => i !== index));
    } else {
      setError("Minimal harus ada satu jadwal");
    }
  };

  /**
   * Fungsi untuk mengubah data jadwal
   * @param {number} index - Index jadwal yang diubah
   * @param {"hari" | "jam_mulai" | "jam_selesai"} field - Field yang diubah
   * @param {string} value - Nilai baru
   */
  const handleChangeJadwal = (index: number, field: "hari" | "jam_mulai" | "jam_selesai", value: string) => {
    const updatedJadwal = [...jadwal];
    updatedJadwal[index][field] = value;
    setJadwal(updatedJadwal);
  };

  /**
   * Fungsi untuk menambahkan edukasi/karir baru
   */
  const handleAddEdukasiKarir = () => {
    setEdukasiKarir([...edukasiKarir, { judul: "", tahun_mulai: "", tahun_selesai: "" }]);
  };

  /**
   * Fungsi untuk menghapus edukasi/karir
   * @param {number} index - Index edukasi/karir yang akan dihapus
   */
  const handleDeleteEdukasiKarir = (index: number) => {
    if (edukasiKarir.length > 1) {
      setEdukasiKarir(edukasiKarir.filter((_, i) => i !== index));
    } else {
      setError("Minimal harus ada satu edukasi/karir");
    }
  };

  /**
   * Fungsi untuk mengubah data edukasi/karir
   * @param {number} index - Index edukasi/karir yang diubah
   * @param {"judul" | "tahun_mulai" | "tahun_selesai"} field - Field yang diubah
   * @param {string} value - Nilai baru
   */
  const handleChangeEdukasiKarir = (index: number, field: "judul" | "tahun_mulai" | "tahun_selesai", value: string) => {
    const updatedEdukasiKarir = [...edukasiKarir];
    updatedEdukasiKarir[index][field] = value;
    setEdukasiKarir(updatedEdukasiKarir);
  };

  /**
   * Fungsi untuk menangani upload file foto
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  /**
   * Fungsi untuk mereset form ke nilai awal
   */
  const handleResetForm = () => {
    setSelectedDokter({ value: "", label: "" });
    setSelectedSpesialis({ value: "", label: "" });
    setBackgroundDokter("");
    setFoto(null);
    setJadwal([{ hari: "", jam_mulai: "", jam_selesai: "" }]);
    setEdukasiKarir([{ judul: "", tahun_mulai: "", tahun_selesai: "" }]);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} Hasil validasi
   */
  const validateForm = () => {
    // Validasi dasar
    if (!selectedDokter.value) {
      setError("Dokter harus dipilih");
      return false;
    }

    if (!selectedSpesialis.value) {
      setError("Spesialis harus dipilih");
      return false;
    }

    // Validasi jadwal
    for (const item of jadwal) {
      if (!item.hari || !item.jam_mulai || !item.jam_selesai) {
        setError("Semua jadwal harus diisi lengkap");
        return false;
      }
    }

    // Validasi edukasi/karir
    for (const item of edukasiKarir) {
      if (!item.judul || !item.tahun_mulai) {
        setError("Judul dan tahun mulai edukasi/karir harus diisi");
        return false;
      }
    }

    return true;
  };

  /**
   * Fungsi untuk menangani submit form
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Mempersiapkan FormData untuk unggah file
      const formData = new FormData();
      formData.append("dokter_id", selectedDokter.value);
      formData.append("spesialis_id", selectedSpesialis.value);

      if (backgroundDokter) {
        formData.append("background_dokter", backgroundDokter);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      // Append jadwal_dokter dan edukasi_karir sebagai JSON string
      formData.append("jadwal_dokter", JSON.stringify(jadwal));
      formData.append("edukasi_karir", JSON.stringify(edukasiKarir));

      const response = await createJadwalDokter(formData);

      if (response.success) {
        router.push("/dashboard/jadwal-dokter");
      } else {
        setError("Gagal menambahkan jadwal dokter");
      }
    } catch (error: any) {
      console.error("Error creating jadwal dokter:", error);
      setError(error.response?.data?.message || "Terjadi kesalahan saat menambahkan jadwal dokter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Jadwal Dokter Baru</h1>
        <Link href="/dashboard/jadwal-dokter" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md">
          Kembali
        </Link>
      </div>

      {/* Form tambah jadwal dokter */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Error Message */}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {/* Upload Foto */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">Upload Foto</label>
          <div className="flex items-center flex-1">
            <label
              htmlFor="foto"
              className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Icon path={mdiUpload} size={1} className="mr-2" />
              Browse
            </label>
            <input id="foto" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{foto ? foto.name : "max. 2mb"}</span>
          </div>
        </div>
        {/* Pilih Dokter dengan react-select */}
        <div className="mb-6 flex items-center">
          <label htmlFor="dokter" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Dokter <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            {/*
              Komponen AsyncSelect digunakan untuk memilih dokter secara async
              Lihat dokumentasi react-select AsyncSelect
            */}
            <AsyncSelect
              cacheOptions
              defaultOptions={dokterList.map((dokter) => ({ value: dokter.id, label: dokter.nama_dokter }))}
              loadOptions={loadDokterOptions}
              inputId="dokter"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              isDisabled={loading || loadingDropdown}
              placeholder="Pilih Dokter..."
              value={selectedDokter.value ? selectedDokter : null}
              onChange={(option) => {
                setSelectedDokter(option ? { value: option.value, label: option.label } : { value: "", label: "" });
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                }),
                menu: (base) => ({ ...base, zIndex: 20 }),
              }}
              required
            />
          </div>
        </div>
        {/* Pilih Spesialis dengan react-select */}
        <div className="mb-6 flex items-center">
          <label htmlFor="spesialis" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Spesialis <span className="text-red-500">*</span>
          </label>
          <div className="flex-1">
            {/*
              Komponen AsyncSelect digunakan untuk memilih spesialis secara async
              Lihat dokumentasi react-select AsyncSelect
            */}
            <AsyncSelect
              cacheOptions
              defaultOptions={spesialisList.map((spesialis) => ({ value: spesialis.id, label: spesialis.nama_layanan }))}
              loadOptions={loadSpesialisOptions}
              inputId="spesialis"
              classNamePrefix="react-select"
              isSearchable
              isClearable
              isDisabled={loading || loadingDropdown}
              placeholder="Pilih Spesialis..."
              value={selectedSpesialis.value ? selectedSpesialis : null}
              onChange={(option) => {
                setSelectedSpesialis(option ? { value: option.value, label: option.label } : { value: "", label: "" });
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 42,
                }),
                menu: (base) => ({ ...base, zIndex: 20 }),
              }}
              required
            />
          </div>
        </div>

        {/* Background Dokter */}
        <div className="mb-6 flex">
          <label htmlFor="backgroundDokter" className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2">
            Background Dokter
          </label>
          <textarea
            id="backgroundDokter"
            value={backgroundDokter}
            onChange={(e) => setBackgroundDokter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
            placeholder="Masukkan background dokter"
            disabled={loading}
          ></textarea>
        </div>
        {/* Jadwal Dokter */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Jadwal Dokter</label>

          {jadwal.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/3">
                <label className="text-xs text-gray-500 mb-1">Hari</label>
                <select
                  value={item.hari}
                  onChange={(e) => handleChangeJadwal(index, "hari", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                >
                  <option value="">Pilih Hari</option>
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>

              <div className="flex flex-col w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Mulai</label>
                <input
                  type="time"
                  value={item.jam_mulai}
                  onChange={(e) => handleChangeJadwal(index, "jam_mulai", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/4">
                <label className="text-xs text-gray-500 mb-1">Jam Selesai</label>
                <input
                  type="time"
                  value={item.jam_selesai}
                  onChange={(e) => handleChangeJadwal(index, "jam_selesai", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteJadwal(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddJadwal}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tambah Hari
          </button>
        </div>
        {/* Section Edukasi / Karir */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">Edukasi / Karir</label>

          {edukasiKarir.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="text-xs text-gray-500 mb-1">Pendidikan</label>
                <input
                  type="text"
                  value={item.judul}
                  onChange={(e) => handleChangeEdukasiKarir(index, "judul", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Judul Edukasi / Karir"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Mulai</label>
                <input
                  type="number"
                  value={item.tahun_mulai}
                  onChange={(e) => handleChangeEdukasiKarir(index, "tahun_mulai", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Mulai"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">Tahun Selesai</label>
                <input
                  type="number"
                  value={item.tahun_selesai}
                  onChange={(e) => handleChangeEdukasiKarir(index, "tahun_selesai", e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Selesai"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteEdukasiKarir(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEdukasiKarir}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tambah Baru
          </button>
        </div>
        {/* Tombol Simpan dan Reset */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${
              loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 text-white"}`}
          >
            {loading ? "Saving..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
