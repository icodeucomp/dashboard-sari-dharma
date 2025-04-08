"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiUpload } from "@mdi/js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import "moment/locale/id";
import {
  getJadwalDokterById,
  updateJadwalDokter,
  getDokterList,
  getSpesialisList,
  Dokter,
  Spesialis,
  JadwalItem,
  EdukasiKarirItem,
} from "@/app/services/jadwalDokterService";

/**
 * Halaman untuk mengedit jadwal dokter
 * @returns {JSX.Element}
 */
export default function EditJadwalDokter() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  // State untuk form
  const [dokterId, setDokterId] = useState<string>("");
  const [spesialisId, setSpesialisId] = useState<string>("");
  const [backgroundDokter, setBackgroundDokter] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState("");
  const [jadwal, setJadwal] = useState<JadwalItem[]>([
    { hari: "", jam_mulai: "", jam_selesai: "" },
  ]);
  const [edukasiKarir, setEdukasiKarir] = useState<EdukasiKarirItem[]>([
    { judul: "", tahun_mulai: "", tahun_selesai: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk data dropdown
  const [dokterList, setDokterList] = useState<Dokter[]>([]);
  const [spesialisList, setSpesialisList] = useState<Spesialis[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  /**
   * Fungsi untuk memuat data jadwal dokter berdasarkan ID
   */
  const fetchJadwalDokter = async () => {
    try {
      setIsLoading(true);
      const response = await getJadwalDokterById(id);

      if (response.success) {
        const data = response.data;
        setDokterId(data.dokter_id);
        setSpesialisId(data.spesialis_id);
        setBackgroundDokter(data.background_dokter || "");
        setCurrentFoto(data.foto || "");

        // Jadikan array kosong jika tidak ada jadwal
        if (data.jadwal_dokter && data.jadwal_dokter.length > 0) {
          setJadwal(data.jadwal_dokter);
        } else {
          setJadwal([{ hari: "", jam_mulai: "", jam_selesai: "" }]);
        }

        // Jadikan array kosong jika tidak ada edukasi/karir
        if (data.edukasi_karir && data.edukasi_karir.length > 0) {
          setEdukasiKarir(data.edukasi_karir);
        } else {
          setEdukasiKarir([{ judul: "", tahun_mulai: "", tahun_selesai: "" }]);
        }
      } else {
        setError("Gagal memuat data jadwal dokter");
      }
    } catch (error) {
      console.error("Error fetching jadwal dokter:", error);
      setError("Gagal memuat data jadwal dokter");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fungsi untuk memuat data dokter dan spesialis untuk dropdown
   */
  const fetchDropdownData = async () => {
    try {
      setLoadingDropdown(true);

      const [dokterResponse, spesialisResponse] = await Promise.all([
        getDokterList(),
        getSpesialisList(),
      ]);

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
   * Memuat data saat komponen dimount
   */
  useEffect(() => {
    fetchDropdownData();
    fetchJadwalDokter();
  }, [id]);

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
  const handleChangeJadwal = (
    index: number,
    field: "hari" | "jam_mulai" | "jam_selesai",
    value: string
  ) => {
    const updatedJadwal = [...jadwal];
    updatedJadwal[index][field] = value;
    setJadwal(updatedJadwal);
  };

  /**
   * Fungsi untuk menambahkan edukasi/karir baru
   */
  const handleAddEdukasiKarir = () => {
    setEdukasiKarir([
      ...edukasiKarir,
      { judul: "", tahun_mulai: "", tahun_selesai: "" },
    ]);
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
  const handleChangeEdukasiKarir = (
    index: number,
    field: "judul" | "tahun_mulai" | "tahun_selesai",
    value: string
  ) => {
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
   * Fungsi untuk mereset form ke data awal
   */
  const handleResetForm = () => {
    fetchJadwalDokter();
    setFoto(null);
    setError("");
  };

  /**
   * Fungsi untuk validasi form sebelum submit
   * @returns {boolean} Hasil validasi
   */
  const validateForm = () => {
    // Validasi dasar
    if (!dokterId) {
      setError("Dokter harus dipilih");
      return false;
    }

    if (!spesialisId) {
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
      formData.append("dokter_id", dokterId);
      formData.append("spesialis_id", spesialisId);

      if (backgroundDokter) {
        formData.append("background_dokter", backgroundDokter);
      }

      if (foto) {
        formData.append("foto", foto);
      }

      // Append jadwal_dokter dan edukasi_karir sebagai JSON string
      formData.append("jadwal_dokter", JSON.stringify(jadwal));
      formData.append("edukasi_karir", JSON.stringify(edukasiKarir));

      const response = await updateJadwalDokter(id, formData);

      if (response.success) {
        router.push("/dashboard/jadwal-dokter");
      } else {
        setError("Gagal mengupdate jadwal dokter");
      }
    } catch (error: any) {
      console.error("Error updating jadwal dokter:", error);
      setError(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengupdate jadwal dokter"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header halaman */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-[16px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Jadwal Dokter
        </h1>
        <Link
          href="/dashboard/jadwal-dokter"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Kembali
        </Link>
      </div>

      {/* Form edit jadwal dokter */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Foto Saat Ini dan Upload Foto Baru */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Foto Saat Ini
            </label>
            <div className="flex-1">
              {currentFoto ? (
                <div className="relative h-48 w-full max-w-xs">
                  <Image
                    src={`${BASE_URL}/storage/${currentFoto}`}
                    alt="Foto Dokter"
                    width={200}
                    height={200}
                    className="h-48 object-cover border"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada foto
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
              Upload Foto Baru
            </label>
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
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                {foto ? foto.name : "max. 2mb"}
              </span>
            </div>
          </div>
        </div>

        {/* Pilih Dokter */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="dokter"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Dokter <span className="text-red-500">*</span>
          </label>
          <select
            id="dokter"
            value={dokterId}
            onChange={(e) => setDokterId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
            disabled={loading || loadingDropdown}
          >
            <option value="">Pilih Dokter</option>
            {Array.isArray(dokterList) ? (
              dokterList.map((dokter) => (
                <option key={dokter.id} value={dokter.id}>
                  {dokter.nama_dokter}
                </option>
              ))
            ) : (
              <option value="">Data dokter tidak tersedia</option>
            )}
          </select>
        </div>

        {/* Pilih Spesialis */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="spesialis"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Spesialis <span className="text-red-500">*</span>
          </label>
          <select
            id="spesialis"
            value={spesialisId}
            onChange={(e) => setSpesialisId(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
            disabled={loading || loadingDropdown}
          >
            <option value="">Pilih Spesialis</option>
            {Array.isArray(spesialisList) ? (
              spesialisList.map((spesialis) => (
                <option key={spesialis.id} value={spesialis.id}>
                  {spesialis.nama_layanan}
                </option>
              ))
            ) : (
              <option value="">Data spesialis tidak tersedia</option>
            )}
          </select>
        </div>

        {/* Background Dokter */}
        <div className="mb-6 flex">
          <label
            htmlFor="backgroundDokter"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4 pt-2"
          >
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
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            Jadwal Dokter
          </label>

          {jadwal.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/3">
                <label className="text-xs text-gray-500 mb-1">Hari</label>
                <select
                  value={item.hari}
                  onChange={(e) =>
                    handleChangeJadwal(index, "hari", e.target.value)
                  }
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
                  onChange={(e) =>
                    handleChangeJadwal(index, "jam_mulai", e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/4">
                <label className="text-xs text-gray-500 mb-1">
                  Jam Selesai
                </label>
                <input
                  type="time"
                  value={item.jam_selesai}
                  onChange={(e) =>
                    handleChangeJadwal(index, "jam_selesai", e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteJadwal(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddJadwal}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Tambah Hari
          </button>
        </div>

        {/* Section Edukasi / Karir */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            Edukasi / Karir
          </label>

          {edukasiKarir.map((item, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="text-xs text-gray-500 mb-1">
                  Pendidikan
                </label>
                <input
                  type="text"
                  value={item.judul}
                  onChange={(e) =>
                    handleChangeEdukasiKarir(index, "judul", e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Judul Edukasi / Karir"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">
                  Tahun Mulai
                </label>
                <input
                  type="number"
                  value={item.tahun_mulai}
                  onChange={(e) =>
                    handleChangeEdukasiKarir(
                      index,
                      "tahun_mulai",
                      e.target.value
                    )
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Mulai"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col w-1/5">
                <label className="text-xs text-gray-500 mb-1">
                  Tahun Selesai
                </label>
                <input
                  type="number"
                  value={item.tahun_selesai}
                  onChange={(e) =>
                    handleChangeEdukasiKarir(
                      index,
                      "tahun_selesai",
                      e.target.value
                    )
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tahun Selesai"
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => handleDeleteEdukasiKarir(index)}
                disabled={loading}
                className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 py-2 px-4 rounded-md mt-5 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon path={mdiDelete} size={0.8} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddEdukasiKarir}
            disabled={loading}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`font-medium py-2 px-6 rounded-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
