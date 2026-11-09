"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPlus, mdiDelete, mdiContentSave } from "@mdi/js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocialMediaContent, updateSocialMediaContent } from "@/app/services/socialMediaContentService";
import { PageHeader, LoadingState } from "@/app/components/ui";

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
    <div className="form-card">
      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      <div>
        {links.map((link, index) => (
          <div key={index} className="form-row">
            <label className="form-label">
              Link {index + 1} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => handleChange(index, e.target.value)}
              className="form-input"
              placeholder={`Masukkan link ${index + 1}`}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
                className="btn btn-danger"
              >
                <Icon path={mdiDelete} size={0.8} />
                Hapus
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setLinks([...links, ""])}
          className="btn btn-primary"
        >
          <Icon path={mdiPlus} size={0.8} />
          Tambah Dokter
        </button>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="btn btn-primary"
        >
          <Icon path={mdiContentSave} size={0.8} />
          {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
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
    <div className="page">
      <PageHeader title="Konten Social Media" description="Link video YouTube dan postingan Instagram yang tampil di website." />

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`px-6 py-2.5 text-sm font-semibold ${
              activeTab === tab.type
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState />}
      {isError && <div className="alert-error">Gagal memuat data. Muat ulang halaman atau coba lagi nanti.</div>}
      {links && <LinksEditor key={`${activeTab}:${links.join("|")}`} type={activeTab} initialLinks={links.length > 0 ? links : [""]} />}
    </div>
  );
}
