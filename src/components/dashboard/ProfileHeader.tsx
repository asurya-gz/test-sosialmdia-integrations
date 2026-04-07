"use client";

import Image from "next/image";
import { Platform, PlatformProfile } from "@/types";
import { formatViewCount, getProxyImageUrl } from "@/lib/utils";

const PLATFORM_CONFIG: Record<Platform, { color: string; ring: string; statBg: string }> = {
  youtube: {
    color: "text-red-400",
    ring: "ring-red-500/30",
    statBg: "bg-red-500/10 border-red-500/15",
  },
  tiktok: {
    color: "text-cyan-400",
    ring: "ring-cyan-500/30",
    statBg: "bg-cyan-500/10 border-cyan-500/15",
  },
  instagram: {
    color: "text-pink-400",
    ring: "ring-pink-500/30",
    statBg: "bg-pink-500/10 border-pink-500/15",
  },
};

interface ProfileHeaderProps {
  profile: PlatformProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const config = PLATFORM_CONFIG[profile.platform];
  const profileImageUrl = getProxyImageUrl(profile.profileImageUrl);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3">
      <div className="flex items-center gap-3">
        <div className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ${config.ring}`}>
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={profile.displayName}
              fill
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/50">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white/90">{profile.displayName}</p>
          <p className={`text-xs font-medium ${config.color}`}>{profile.username}</p>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className={`rounded-lg border p-2 ${config.statBg}`}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Total Views</p>
          <p className="mt-0.5 text-sm font-bold text-white/85">{formatViewCount(profile.totalViews)}</p>
        </div>
        <div className={`rounded-lg border p-2 ${config.statBg}`}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">Konten</p>
          <p className="mt-0.5 text-sm font-bold text-white/85">{profile.contents.length}</p>
        </div>
      </div>
    </div>
  );
}
