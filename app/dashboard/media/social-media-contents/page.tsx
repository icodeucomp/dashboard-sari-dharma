"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiContentSave } from "@mdi/js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocialMediaContent, updateSocialMediaContent } from "@/app/services/socialMediaContentService";

type SocialType = "youtube" | "instagram";

const TABS: { type: SocialType; label: string }[] = [
  { type: "youtube", label: "Youtube" },
  { type: "instagram", label: "Instagram" },
];

function LinksEditor({ type, initialLinks }: { type: SocialType; initialLinks: string[] }) {
  const queryClient = useQueryClient();
  const [links, setLinks] = useState<string[]>(initialLinks);
  const [error, setError] = useState("");

  const saveMutation = useMutation({
    mutationFn: () => updateSocialMediaContent(type, { type, links }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-media-contents"] });
      alert("Data berhasil disimpan.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data."),
  });

  const handleSave = () => {
    setError("");
    saveMutation.mutate();
  };

  const handleChange = (index: number, value: string) => {
    setLinks(links.map((link, i) => (i === index ? value : link)));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div>
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-4 mb-4">
            <label className="w-1/4 text-sm font-medium text-gray-700 dark:text-gray-300">
              Link {index + 1} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder={`Masukkan link ${index + 1}`}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
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
          onClick={() => setLinks([...links, ""])}
          className="cursor-pointer flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md"
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          Add More
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className={`cursor-pointer flex items-center bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md ${
            saveMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Icon path={mdiContentSave} size={0.8} className="mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function SocialMediaContent() {
  const [activeTab, setActiveTab] = useState<SocialType>("youtube");

  const { data: links, isLoading, isError } = useQuery({
    queryKey: ["social-media-contents", activeTab],
    queryFn: () => getSocialMediaContent({ type: activeTab }),
    select: (response) => response.data.data.map((item: { links: string }) => item.links),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Konten Social Media
      </h1>

      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`cursor-pointer px-6 py-2 font-medium ${
              activeTab === tab.type
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>}
      {isError && <p className="text-red-600">Gagal memuat data.</p>}
      {links && <LinksEditor key={`${activeTab}:${links.join("|")}`} type={activeTab} initialLinks={links.length > 0 ? links : [""]} />}
    </div>
  );
}
