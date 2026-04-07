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
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="section-shell overflow-hidden rounded-[28px] px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">
                Social Performance Monitor
              </div>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--color-ink-950)] md:text-5xl">
                  Pantau performa akun media sosial dalam satu dashboard yang ringkas dan elegan.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[var(--color-ink-700)] md:text-base">
                  Lihat total views, konten terbaru, profil akun, dan pembaruan data dari YouTube,
                  TikTok, dan Instagram tanpa perlu berpindah halaman.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
                  Platform aktif
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink-950)]">{loadedProfiles.length}/3</p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
                  Total views
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink-950)]">
                  {loadedProfiles.length ? formatViewCount(totalViews) : "-"}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
                  Konten tampil
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink-950)]">
                  {loadedProfiles.length ? totalContents : 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_2.05fr]">
          <div className="space-y-6">
            <SearchForm onSearch={handleSearch} isLoading={isAnyLoading} />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-ink-950)]">Account Overview</h2>
              <p className="text-sm text-[var(--color-ink-500)]">
                Ringkasan tiap platform disusun agar mudah dipantau dan dibandingkan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 2xl:grid-cols-3">
              {PLATFORMS.map((platform) => (
                <PlatformCard
                  key={platform}
                  platform={platform}
                  state={state[platform]}
                  onRefresh={() => fetchPlatform(platform, inputsRef.current[platform])}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
