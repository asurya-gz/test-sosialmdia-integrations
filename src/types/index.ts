// Tipe data utama yang digunakan di seluruh aplikasi

export type Platform = "youtube" | "tiktok" | "instagram";

export interface ContentItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewCount: number;
  url: string;
  publishedAt: string;
}

export interface PlatformProfile {
  platform: Platform;
  username: string;
  displayName: string;
  profileImageUrl: string;
  totalViews: number;
  contents: ContentItem[];
}

export interface PlatformState {
  data: PlatformProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardInputs {
  youtube: string;
  tiktok: string;
  instagram: string;
}
