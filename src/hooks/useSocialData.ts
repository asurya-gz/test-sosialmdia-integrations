"use client";

import { useState, useCallback } from "react";
import { DashboardInputs, PlatformProfile, PlatformState, Platform } from "@/types";

type SocialDataState = Record<Platform, PlatformState>;

const initialState: SocialDataState = {
  youtube: { data: null, isLoading: false, error: null },
  tiktok: { data: null, isLoading: false, error: null },
  instagram: { data: null, isLoading: false, error: null },
};

export function useSocialData() {
  const [state, setState] = useState<SocialDataState>(initialState);

  const setPlatformState = (platform: Platform, update: Partial<PlatformState>) => {
    setState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], ...update },
    }));
  };

  const fetchPlatform = useCallback(async (platform: Platform, identifier: string) => {
    if (!identifier.trim()) return;

    setPlatformState(platform, { isLoading: true, error: null });

    try {
      const params =
        platform === "youtube"
          ? `handle=${encodeURIComponent(identifier)}`
          : `username=${encodeURIComponent(identifier)}`;

      const res = await fetch(`/api/${platform}?${params}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Terjadi kesalahan");

      setPlatformState(platform, { data: json as PlatformProfile, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setPlatformState(platform, { error: message, isLoading: false });
    }
  }, []);

  const fetchAll = useCallback(
    (inputs: DashboardInputs) => {
      const platforms: Platform[] = ["youtube", "tiktok", "instagram"];
      platforms.forEach((p) => {
        if (inputs[p]) fetchPlatform(p, inputs[p]);
      });
    },
    [fetchPlatform]
  );

  const refreshPlatform = useCallback(
    (platform: Platform, identifier: string) => {
      fetchPlatform(platform, identifier);
    },
    [fetchPlatform]
  );

  return { state, fetchAll, fetchPlatform, refreshPlatform };
}
