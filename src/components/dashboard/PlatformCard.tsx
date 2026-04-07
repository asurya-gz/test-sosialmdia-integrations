"use client";

import { Platform, PlatformState } from "@/types";
import { ProfileHeader } from "./ProfileHeader";
import { ContentList } from "./ContentList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { RefreshButton } from "@/components/ui/RefreshButton";

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
};

const PLATFORM_TONES: Record<Platform, string> = {
  youtube: "from-red-500/12 via-white to-orange-500/10",
  tiktok: "from-slate-900/8 via-white to-cyan-500/10",
  instagram: "from-pink-500/14 via-white to-amber-500/10",
};

interface PlatformCardProps {
  platform: Platform;
  state: PlatformState;
  onRefresh: () => void;
}

export function PlatformCard({ platform, state, onRefresh }: PlatformCardProps) {
  const { data, isLoading, error } = state;

  return (
    <div
      className={`glass-card flex min-h-[560px] flex-col rounded-[26px] bg-gradient-to-br ${PLATFORM_TONES[platform]}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 px-5 pt-5 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
            Platform
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--color-ink-950)]">{PLATFORM_LABELS[platform]}</h3>
        </div>
        {data && <RefreshButton onRefresh={onRefresh} isLoading={isLoading} />}
      </div>

      <div className="flex-1 p-5">
        {isLoading && <LoadingSpinner />}

        {!isLoading && error && <ErrorMessage message={error} />}

        {!isLoading && !error && !data && (
          <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-12 text-center">
            <p className="text-sm font-medium text-[var(--color-ink-950)]">Belum ada data {PLATFORM_LABELS[platform]}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
              Masukkan akun pada form lalu tampilkan dashboard untuk memuat data platform ini.
            </p>
          </div>
        )}

        {!isLoading && data && (
          <div className="space-y-5">
            <ProfileHeader profile={data} />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-500)]">
                5 Konten Terbaru
              </p>
              <ContentList contents={data.contents} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
