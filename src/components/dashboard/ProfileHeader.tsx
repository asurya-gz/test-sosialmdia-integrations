"use client";

import Image from "next/image";
import { Platform, PlatformProfile } from "@/types";
import { formatViewCount, getProxyImageUrl } from "@/lib/utils";

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bg: string }> = {
  youtube: { label: "YouTube", color: "text-red-600", bg: "from-red-50 to-orange-50" },
  tiktok: { label: "TikTok", color: "text-gray-900", bg: "from-slate-50 to-cyan-50" },
  instagram: { label: "Instagram", color: "text-pink-600", bg: "from-pink-50 to-amber-50" },
};

interface ProfileHeaderProps {
  profile: PlatformProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const config = PLATFORM_CONFIG[profile.platform];
  const profileImageUrl = getProxyImageUrl(profile.profileImageUrl);

  return (
    <div className={`rounded-[22px] border border-white/80 bg-gradient-to-br ${config.bg} p-4`}>
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-4 ring-white/80">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={profile.displayName}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-500">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${config.color}`}>
            {config.label}
          </p>
          <p className="truncate text-lg font-semibold text-[var(--color-ink-950)]">{profile.displayName}</p>
          <p className="text-xs text-[var(--color-ink-500)]">@{profile.username}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/72 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-500)]">
            Total views
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--color-ink-950)]">
            {formatViewCount(profile.totalViews)}
          </p>
        </div>
        <div className="rounded-2xl bg-white/72 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-500)]">
            Konten tampil
          </p>
          <p className="mt-2 text-2xl font-semibold text-[var(--color-ink-950)]">
            {profile.contents.length}
          </p>
        </div>
      </div>
    </div>
  );
}
