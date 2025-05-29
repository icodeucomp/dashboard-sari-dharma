"use client";

import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiContentSave } from "@mdi/js";
import { getKontenSocialMedia, updateKontenSocialMedia } from "@/app/services/kontenSocialMediaService";

/**
 * Halaman untuk Konten Social Media
 * @returns {JSX.Element}
 */
export default function KontenSocialMedia() {
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">("youtube");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fungsi untuk memuat data berdasarkan tab aktif
   */
  const fetchData = async (type: "youtube" | "instagram") => {
    try {
      setLoading(true);
      setError("");

      const response = await getKontenSocialMedia({ type });

      if (response.success && response.data.data.length > 0) {
        const konten = response.data.data as any;
        const beforePush: Array<string> = []
        konten.forEach((item: any) => {
          beforePush.push(item.links);
        })
        setLinks(beforePush);
        console.log("Konten Social Media:", links);
      } else {
        setLinks([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fungsi untuk mengganti tab aktif
   * @param {string} tab - Tab yang akan diaktifkan
   */
  const handleTabChange = (tab: "youtube" | "instagram") => {
    setActiveTab(tab);
    fetchData(tab); // Panggil API hanya untuk tab yang dipilih
  };

  /**
   * Fungsi untuk menambah input link
   */
  const handleAddInput = () => {
    setLinks([...links, ""]);
  };

  /**
   * Fungsi untuk menghapus input link
   * @param {number} index - Index input yang akan dihapus
   */
  const handleDeleteInput = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  /**
   * Fungsi untuk mengubah nilai input link
   * @param {number} index - Index input
   * @param {string} value - Nilai baru
   */
  const handleInputChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  /**
   * Fungsi untuk menyimpan data
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        type: activeTab,
        links,
      };

      const response = await updateKontenSocialMedia(activeTab, payload);

      if (response.success) {
        alert("Data berhasil disimpan.");
      } else {
        setError("Gagal menyimpan data.");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Memuat data saat tab aktif berubah
   */
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <div className="p-6">
      {/* Header halaman */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Konten Social Media
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button
          onClick={() => handleTabChange("youtube")}
          className={`cursor-pointer px-6 py-2 font-medium ${
            activeTab === "youtube"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Youtube
        </button>
        <button
          onClick={() => handleTabChange("instagram")}
          className={`cursor-pointer px-6 py-2 font-medium ${
            activeTab === "instagram"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Instagram
        </button>
      </div>

      {/* Konten Tab */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
        ) : (
          <div>
            {links.map((link, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <label
                  className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Link {index + 1} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={`Masukkan link ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteInput(index)}
                    className="cursor-pointer flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md"
                  >
                    <Icon path={mdiDelete} size={0.8} className="mr-2" />
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInput}
              className="cursor-pointer flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
            >
              <Icon path={mdiPlus} size={0.8} className="mr-2" />
              Add More
            </button>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className={`cursor-pointer flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Icon path={mdiContentSave} size={0.8} className="mr-2" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
