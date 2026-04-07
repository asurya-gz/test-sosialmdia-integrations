"use client";

import { useState } from "react";
import { DashboardInputs } from "@/types";

const FIELD_CONFIG = [
  {
    key: "youtube" as const,
    label: "YouTube",
    placeholder: "@channelHandle",
    gradient: "from-red-600 to-orange-500",
    glow: "focus:border-red-500/50 focus:ring-red-500/15",
    text: "text-red-400",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    placeholder: "username",
    gradient: "from-slate-700 to-cyan-600",
    glow: "focus:border-cyan-500/50 focus:ring-cyan-500/15",
    text: "text-cyan-400",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-white">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    placeholder: "username",
    gradient: "from-pink-600 to-amber-500",
    glow: "focus:border-pink-500/50 focus:ring-pink-500/15",
    text: "text-pink-400",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Account Lookup</p>
        <h2 className="mt-0.5 text-sm font-semibold text-white/80">Cari akun yang ingin dipantau</h2>
      </div>

      <div className="flex flex-col gap-3">
        {FIELD_CONFIG.map(({ key, label, placeholder, gradient, glow, text, icon }) => (
          <div key={key}>
            <label className={`mb-1.5 flex items-center gap-2 text-xs font-semibold ${text}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} shadow-md`}
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
              className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/80 outline-none transition placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-2 ${glow}`}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !Object.values(inputs).some((v) => v.trim())}
        className="relative rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "Memuat data..." : "Tampilkan Dashboard"}
      </button>

      <p className="text-[10px] leading-4 text-white/20">
        Contoh: `@GoogleDevelopers` · `nba` · `instagram`
      </p>
    </form>
  );
}
