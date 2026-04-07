"use client";

import { useState } from "react";
import { DashboardInputs } from "@/types";

interface SearchFormProps {
  onSearch: (inputs: DashboardInputs) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [inputs, setInputs] = useState<DashboardInputs>({
    youtube: "",
    tiktok: "",
    instagram: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputs);
  };

  const fields = [
    {
      key: "youtube" as const,
      label: "YouTube",
      placeholder: "@channelHandle",
      accent: "from-red-500/16 to-orange-500/10",
      text: "text-red-600",
      icon: "YT",
    },
    {
      key: "tiktok" as const,
      label: "TikTok",
      placeholder: "username",
      accent: "from-slate-900/12 to-cyan-500/12",
      text: "text-slate-900",
      icon: "TT",
    },
    {
      key: "instagram" as const,
      label: "Instagram",
      placeholder: "username",
      accent: "from-pink-500/16 to-amber-500/12",
      text: "text-pink-600",
      icon: "IG",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-[24px] p-6">
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
          Account Lookup
        </p>
        <h2 className="text-2xl font-semibold text-[var(--color-ink-950)]">Cari akun yang ingin dipantau</h2>
        <p className="text-sm leading-6 text-[var(--color-ink-700)]">
          Masukkan username atau handle untuk menampilkan data terbaru dari beberapa platform sekaligus.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4">
        {fields.map(({ key, label, placeholder, accent, text, icon }) => (
          <div key={key}>
            <label className={`mb-2 flex items-center gap-3 text-sm font-medium ${text}`}>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-xs font-bold`}
              >
                {icon}
              </span>
              {label}
            </label>
            <input
              type="text"
              value={inputs[key]}
              onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-teal-100"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isLoading || !Object.values(inputs).some((v) => v.trim())}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-ink-950)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-ink-900)] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "Memuat data..." : "Lihat Data"}
        </button>
        <p className="text-xs leading-5 text-[var(--color-ink-500)]">
          Contoh input: YouTube `@GoogleDevelopers`, TikTok `nba`, Instagram `instagram`
        </p>
      </div>
    </form>
  );
}
