"use client";

import { useRef } from "react";
import { Platform, DashboardInputs } from "@/types";
import { useSocialData } from "@/hooks/useSocialData";
import { formatViewCount } from "@/lib/utils";
import { SearchForm } from "@/components/forms/SearchForm";
import { PlatformCard } from "./PlatformCard";

const PLATFORMS: Platform[] = ["youtube", "tiktok", "instagram"];

export function Dashboard() {
  const { state, fetchAll, fetchPlatform } = useSocialData();
  const inputsRef = useRef<DashboardInputs>({ youtube: "", tiktok: "", instagram: "" });

  const isAnyLoading = PLATFORMS.some((platform) => state[platform].isLoading);
  const loadedProfiles = PLATFORMS.map((platform) => state[platform].data).filter(Boolean);
  const totalViews = loadedProfiles.reduce((sum, profile) => sum + (profile?.totalViews ?? 0), 0);
  const totalContents = loadedProfiles.reduce((sum, profile) => sum + (profile?.contents.length ?? 0), 0);

  const handleSearch = (inputs: DashboardInputs) => {
    inputsRef.current = inputs;
    fetchAll(inputs);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#060b18]">
      {/* Sidebar */}
      <aside className="sidebar-panel flex w-[290px] shrink-0 flex-col p-5">
        {/* Brand */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">SocialScope</p>
            <p className="text-[10px] uppercase tracking-widest text-white/30">Performance Monitor</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400/70">Aktif</p>
            <p className="mt-0.5 text-base font-bold text-indigo-300">{loadedProfiles.length}/3</p>
          </div>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-sky-400/70">Views</p>
            <p className="mt-0.5 text-base font-bold text-sky-300">
              {loadedProfiles.length ? formatViewCount(totalViews) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400/70">Konten</p>
            <p className="mt-0.5 text-base font-bold text-violet-300">
              {loadedProfiles.length ? totalContents : 0}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-4 h-px bg-white/[0.06]" />

        {/* Search form */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SearchForm onSearch={handleSearch} isLoading={isAnyLoading} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col p-5">
        {/* Header bar */}
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">Account Overview</h1>
            <p className="text-xs text-white/35">Data profil & konten terbaru dari setiap platform</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Live</span>
          </div>
        </div>

        {/* Platform cards */}
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform}
              platform={platform}
              state={state[platform]}
              onRefresh={() => fetchPlatform(platform, inputsRef.current[platform])}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
