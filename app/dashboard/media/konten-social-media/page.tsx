"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete } from "@mdi/js";

/**
 * Halaman untuk Konten Social Media
 * @returns {JSX.Element}
 */
export default function KontenSocialMedia() {
  const [activeTab, setActiveTab] = useState<"youtube" | "instagram">("youtube");
  const [links, setLinks] = useState([""]);
  const [instagramPosts, setInstagramPosts] = useState([""]);

  /**
   * Fungsi untuk mengganti tab aktif
   * @param {string} tab - Tab yang akan diaktifkan
   */
  const handleTabChange = (tab: "youtube" | "instagram") => {
    setActiveTab(tab);
    if (tab === "youtube") setLinks([""]); // Reset links saat tab berubah ke Youtube
    if (tab === "instagram") setInstagramPosts([""]); // Reset posts saat tab berubah ke Instagram
  };

  /**
   * Fungsi untuk menambah input link (Youtube) atau post (Instagram)
   */
  const handleAddInput = () => {
    if (activeTab === "youtube") {
      setLinks([...links, ""]);
    } else if (activeTab === "instagram") {
      setInstagramPosts([...instagramPosts, ""]);
    }
  };

  /**
   * Fungsi untuk menghapus input link (Youtube) atau post (Instagram)
   * @param {number} index - Index input yang akan dihapus
   */
  const handleDeleteInput = (index: number) => {
    if (activeTab === "youtube") {
      const updatedLinks = links.filter((_, i) => i !== index);
      setLinks(updatedLinks);
    } else if (activeTab === "instagram") {
      const updatedPosts = instagramPosts.filter((_, i) => i !== index);
      setInstagramPosts(updatedPosts);
    }
  };

  /**
   * Fungsi untuk mengubah nilai input link (Youtube) atau post (Instagram)
   * @param {number} index - Index input
   * @param {string} value - Nilai baru
   */
  const handleInputChange = (index: number, value: string) => {
    if (activeTab === "youtube") {
      const updatedLinks = [...links];
      updatedLinks[index] = value;
      setLinks(updatedLinks);
    } else if (activeTab === "instagram") {
      const updatedPosts = [...instagramPosts];
      updatedPosts[index] = value;
      setInstagramPosts(updatedPosts);
    }
  };

  /**
   * Fungsi untuk mereset form
   */
  const handleReset = () => {
    if (activeTab === "youtube") {
      setLinks([""]);
    } else if (activeTab === "instagram") {
      setInstagramPosts([""]);
    }
  };

  /**
   * Fungsi untuk menyimpan data
   */
  const handleSave = () => {
    if (activeTab === "youtube") {
      console.log("Saved Youtube Links:", links);
    } else if (activeTab === "instagram") {
      console.log("Saved Instagram Posts:", instagramPosts);
    }
    // Tambahkan logika penyimpanan di sini
  };

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
          className={`px-6 py-2 font-medium ${
            activeTab === "youtube"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Youtube
        </button>
        <button
          onClick={() => handleTabChange("instagram")}
          className={`px-6 py-2 font-medium ${
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
        {activeTab === "youtube" && (
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
                    className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md"
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
              className="flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
            >
              <Icon path={mdiPlus} size={0.8} className="mr-2" />
              Add More
            </button>
          </div>
        )}

        {activeTab === "instagram" && (
          <div>
            {instagramPosts.map((post, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <label
                  className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Post {index + 1} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={post}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder={`Masukkan post ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteInput(index)}
                    className="flex items-center border border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium py-2 px-4 rounded-md"
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
              className="flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
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
            onClick={handleReset}
            className="border border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-medium py-2 px-6 rounded-md"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
