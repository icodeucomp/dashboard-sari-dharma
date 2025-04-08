"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiRestore } from "@mdi/js";
import { useParams, useRouter } from "next/navigation";
import { getLayananSpesialisById, updateLayananSpesialis } from "@/app/services/layananSpesialisService";
import { getMasterDokter, DokterItem } from "@/app/services/masterDokterService";

// Lazy load IconPicker dan Editor
const IconPicker = dynamic(() => import("@/app/components/IconPicker"), { ssr: false });
const Editor = dynamic(() => import("@/app/components/WysiwygEditor"), { ssr: false });

/**
 * Komponen utama untuk halaman Edit Layanan Spesialis
 * @returns {JSX.Element}
 */
export default function EditLayananSpesialis() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const router = useRouter();

  const [namaLayanan, setNamaLayanan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [dokterTerkait, setDokterTerkait] = useState<string[]>([""]); // Array string ID yang terenkripsi
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dokterList, setDokterList] = useState<DokterItem[]>([]);
  const [loadingDokter, setLoadingDokter] = useState(true);

  /**
   * Fungsi untuk memuat data dokter dari API
   */
  const fetchDokter = async () => {
    try {
      setLoadingDokter(true);
      const response = await getMasterDokter({ per_page: 100 }); // Ambil maksimal 100 dokter
      if (response.success) {
        setDokterList(response.data.data);
      } else {
        console.error("Gagal memuat data dokter");
      }
    } catch (error) {
      console.error("Error fetching dokter data:", error);
    } finally {
      setLoadingDokter(false);
    }
  };
  
  /**
   * Fungsi untuk memuat data layanan spesialis dari API berdasarkan ID
   */
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getLayananSpesialisById(slug as string, id as string);
      if (response.success) {
        const data = response.data;
        setNamaLayanan(data.nama_layanan);
        setDeskripsi(data.deskripsi);
        setSelectedIcon(data.icon);
        
        // Ekstrak ID dokter dari objek dokter
        const dokterIds = data.dokter.map(dokter => dokter.id);
        setDokterTerkait(dokterIds.length > 0 ? dokterIds : [""]);
      } else {
        setError("Gagal memuat data layanan spesialis");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data layanan spesialis");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Memuat data dokter dan layanan spesialis saat komponen dimount
   */
  useEffect(() => {
    const loadData = async () => {
      await fetchDokter();
      await fetchData();
    };
    loadData();
  }, [id]);

  /**
   * Fungsi untuk menambah input dokter terkait
   */
  const handleAddDokter = () => {
    setDokterTerkait([...dokterTerkait, ""]);
  };

  /**
   * Fungsi untuk menghapus input dokter terkait
   * @param {number} index - Index dokter yang akan dihapus
   */
  const handleDeleteDokter = (index: number) => {
    const updatedDokter = dokterTerkait.filter((_, i) => i !== index);
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk mereset semua field dokter spesialis
   */
  const handleResetDokter = () => {
    setDokterTerkait([""]);
  };

  /**
   * Fungsi untuk mengubah nilai dokter terkait
   * @param {number} index - Index dokter terkait
   * @param {string} dokterId - ID dokter yang dipilih (terenkripsi)
   */
  const handleDokterChange = (index: number, dokterId: string) => {
    const updatedDokter = [...dokterTerkait];
    updatedDokter[index] = dokterId;
    setDokterTerkait(updatedDokter);
  };

  /**
   * Fungsi untuk menangani pengiriman formulir update
   * @param {React.FormEvent} e - Event formulir
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!namaLayanan || !selectedIcon) {
      setError("Nama layanan dan ikon wajib diisi.");
      return;
    }

    // Validasi dokter_ids (semua harus dipilih dan tidak boleh kosong)
    const validDokterIds = dokterTerkait.filter(id => id !== "");
    if (dokterTerkait.length > 0 && validDokterIds.length !== dokterTerkait.length) {
      setError("Semua dokter terkait harus dipilih.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Mempersiapkan payload dengan dokter_ids
      const payload = {
        nama_layanan: namaLayanan,
        deskripsi: deskripsi,
        icon: selectedIcon,
        dokter_ids: validDokterIds, // Kirim array string ID yang terenkripsi
      };
      
      const response = await updateLayananSpesialis(id as string, payload);
      
      if (response.success) {
        router.push("/dashboard/layanan-spesialis");
      } else {
        setError("Gagal mengupdate layanan spesialis");
      }
    } catch (error: any) {
      console.error("Error updating service:", error);
      setError(
        error.response?.data?.message ||
        "Terjadi kesalahan saat mengupdate layanan spesialis"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mereset formulir ke data awal
   */
  const handleReset = () => {
    fetchData();
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
          Edit Layanan Spesialis
        </h1>
      </div>

      {/* Form Edit Layanan */}
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

        {/* Pilih Ikon */}
        <div className="mb-6 flex items-center">
          <label className="block text-gray-700 dark:text-gray-300 font-medium w-1/4">
            Pilih Ikon
          </label>
          <div className="flex-1">
            <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          </div>
        </div>

        {/* Nama Layanan */}
        <div className="mb-6 flex items-center">
          <label
            htmlFor="namaLayanan"
            className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
          >
            Nama Layanan <span className="text-red-500">*</span>
          </label>
          <input
            id="namaLayanan"
            type="text"
            value={namaLayanan}
            onChange={(e) => setNamaLayanan(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan nama layanan"
            required
            disabled={loading}
          />
        </div>

        {/* Deskripsi */}
        <div className="mb-6">
          <label
            htmlFor="deskripsi"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >
            Deskripsi
          </label>
          <Editor
            value={deskripsi}
            onChange={(value: string) => setDeskripsi(value)}
            placeholder="Masukkan deskripsi layanan"
          />
        </div>

        {/* Dokter Terkait */}
        {dokterTerkait.map((dokterId, index) => (
          <div key={index} className="mb-6 flex items-center">
            <label
              className="block text-gray-700 dark:text-gray-300 font-medium w-1/4"
            >
              Dokter Spesialis Terkait {index + 1} <span className="text-red-500">*</span>
            </label>
            <div className="flex-1 flex items-center gap-4">
              {loadingDokter ? (
                <div className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700">
                  Memuat data dokter...
                </div>
              ) : (
                <select
                  value={dokterId}
                  onChange={(e) => handleDokterChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>
                    Pilih Dokter
                  </option>
                  {dokterList.map((dokter) => (
                    <option key={dokter.id} value={dokter.id}>
                      {dokter.nama_dokter}
                    </option>
                  ))}
                </select>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleDeleteDokter(index)}
                  className={`flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  <Icon path={mdiDelete} size={0.8} className="mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={handleResetDokter}
            className={`flex items-center border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Icon path={mdiRestore} size={0.8} className="mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleAddDokter}
            className={`flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <Icon path={mdiPlus} size={0.8} className="mr-2" />
            Add More
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleReset}
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