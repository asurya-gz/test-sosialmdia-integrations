import { ContentItem, PlatformProfile } from "@/types";

const RAPID_API_HOST = "tiktok-scraper7.p.rapidapi.com";
const POSTS_PAGE_SIZE = 35;
const MAX_TIKTOK_PAGES = 20;

type TikTokUserInfoResponse = {
  data?: {
    user?: {
      nickname?: string;
      avatarThumb?: string;
    };
    stats?: {
      videoCount?: number;
    };
  };
};

type TikTokVideo = {
  video_id: string;
  title: string;
  cover: string;
  play_count: number;
  create_time: number;
};

type TikTokPostsResponse = {
  data?: {
    videos?: TikTokVideo[];
    cursor?: string;
    hasMore?: boolean;
  };
};

function getRapidApiHeaders() {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY belum diatur di environment variable.");
  }

  return {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": RAPID_API_HOST,
  };
}

function mapTikTokVideoToContentItem(username: string, video: TikTokVideo): ContentItem {
  return {
    id: video.video_id,
    title: video.title || "(Tanpa Judul)",
    thumbnailUrl: video.cover,
    viewCount: video.play_count,
    url: `https://tiktok.com/@${username}/video/${video.video_id}`,
    publishedAt: new Date(video.create_time * 1000).toISOString(),
  };
}

async function getAllTikTokPosts(username: string, totalVideoCount = 0): Promise<TikTokVideo[]> {
  const headers = getRapidApiHeaders();
  const videos: TikTokVideo[] = [];
  const seenIds = new Set<string>();
  let cursor: string | undefined;
  let hasMore = true;
  let page = 0;

  while (hasMore && page < MAX_TIKTOK_PAGES) {
    const url = new URL(`https://${RAPID_API_HOST}/user/posts`);
    url.searchParams.set("unique_id", username);
    url.searchParams.set("count", String(POSTS_PAGE_SIZE));

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const postsRes = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });

    if (!postsRes.ok) {
      throw new Error("Gagal mengambil daftar konten TikTok.");
    }

    const postsData = (await postsRes.json()) as TikTokPostsResponse;
    const pageVideos = postsData.data?.videos ?? [];

    pageVideos.forEach((video) => {
      if (!seenIds.has(video.video_id)) {
        seenIds.add(video.video_id);
        videos.push(video);
      }
    });

    hasMore = Boolean(postsData.data?.hasMore);
    cursor = postsData.data?.cursor;
    page += 1;

    if (!pageVideos.length || !cursor) {
      break;
    }

    if (totalVideoCount > 0 && videos.length >= totalVideoCount) {
      break;
    }
  }

  return videos;
}

export async function getTikTokProfile(username: string): Promise<PlatformProfile> {
  const headers = getRapidApiHeaders();

  const userRes = await fetch(
    `https://${RAPID_API_HOST}/user/info?unique_id=${encodeURIComponent(username)}`,
    { headers, cache: "no-store" }
  );

  if (!userRes.ok) {
    throw new Error("Gagal mengambil data TikTok.");
  }

  const userData = (await userRes.json()) as TikTokUserInfoResponse;
  const user = userData.data?.user;
  const totalVideoCount = userData.data?.stats?.videoCount ?? 0;

  if (!user) {
    throw new Error("Akun TikTok tidak ditemukan.");
  }

  const allVideos = await getAllTikTokPosts(username, totalVideoCount);
  const contents = allVideos.slice(0, 5).map((video) => mapTikTokVideoToContentItem(username, video));
  const totalViews = allVideos.reduce((sum, video) => sum + (video.play_count ?? 0), 0);

  return {
    platform: "tiktok",
    username,
    displayName: user.nickname ?? username,
    profileImageUrl: user.avatarThumb ?? "",
    totalViews,
    contents,
  };
}
