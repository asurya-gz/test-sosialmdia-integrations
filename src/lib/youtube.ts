import { ContentItem, PlatformProfile } from "@/types";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

type YouTubeChannelResponse = {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      customUrl?: string;
      thumbnails?: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
    statistics?: {
      viewCount?: string;
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
  error?: {
    message?: string;
  };
};

type YouTubePlaylistItemsResponse = {
  items?: Array<{
    snippet?: {
      resourceId?: {
        videoId?: string;
      };
    };
  }>;
  error?: {
    message?: string;
  };
};

type YouTubeVideosResponse = {
  items?: Array<{
    id: string;
    snippet: {
      title: string;
      publishedAt: string;
      thumbnails?: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
    statistics?: {
      viewCount?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

function assertApiKey() {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY belum diatur di environment variable.");
  }
}

function normalizeHandle(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Handle YouTube wajib diisi.");
  }

  const fromUrl = trimmed.match(/youtube\.com\/@([^/?#]+)/i);
  if (fromUrl?.[1]) {
    return fromUrl[1];
  }

  return trimmed.replace(/^@/, "");
}

function pickThumbnail(
  thumbnails:
    | {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      }
    | undefined
) {
  return thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url ?? "";
}

async function fetchYouTube<T>(path: string, params: Record<string, string>) {
  assertApiKey();
  const apiKey = process.env.YOUTUBE_API_KEY as string;

  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  const json = (await res.json()) as T & { error?: { message?: string } };

  if (!res.ok) {
    throw new Error(json.error?.message || "Gagal mengambil data dari YouTube.");
  }

  return json;
}

async function getChannelByHandle(handle: string) {
  const normalizedHandle = normalizeHandle(handle);
  const data = await fetchYouTube<YouTubeChannelResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: normalizedHandle,
  });

  const channel = data.items?.[0];
  if (!channel) {
    throw new Error("Channel YouTube tidak ditemukan.");
  }

  return channel;
}

async function getLatestVideos(uploadsPlaylistId: string, maxResults = 5): Promise<ContentItem[]> {
  let playlistData: YouTubePlaylistItemsResponse;

  try {
    playlistData = await fetchYouTube<YouTubePlaylistItemsResponse>("playlistItems", {
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: String(maxResults),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("playlistId") || message.includes("cannot be found")) {
      return [];
    }

    throw error;
  }

  const videoIds = (playlistData.items ?? [])
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId));

  if (!videoIds.length) {
    return [];
  }

  const videosData = await fetchYouTube<YouTubeVideosResponse>("videos", {
    part: "snippet,statistics",
    id: videoIds.join(","),
  });

  return (videosData.items ?? []).map((item): ContentItem => ({
    id: item.id,
    title: item.snippet.title,
    thumbnailUrl: pickThumbnail(item.snippet.thumbnails),
    viewCount: Number.parseInt(item.statistics?.viewCount ?? "0", 10),
    url: `https://www.youtube.com/watch?v=${item.id}`,
    publishedAt: item.snippet.publishedAt,
  }));
}

export async function getYouTubeProfile(handle: string): Promise<PlatformProfile> {
  const normalizedHandle = normalizeHandle(handle);
  const channel = await getChannelByHandle(normalizedHandle);
  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    return {
      platform: "youtube",
      username: channel.snippet.customUrl || normalizedHandle,
      displayName: channel.snippet.title,
      profileImageUrl: pickThumbnail(channel.snippet.thumbnails),
      totalViews: Number.parseInt(channel.statistics?.viewCount ?? "0", 10),
      contents: [],
    };
  }

  const contents = await getLatestVideos(uploadsPlaylistId);

  return {
    platform: "youtube",
    username: channel.snippet.customUrl || normalizedHandle,
    displayName: channel.snippet.title,
    profileImageUrl: pickThumbnail(channel.snippet.thumbnails),
    totalViews: Number.parseInt(channel.statistics?.viewCount ?? "0", 10),
    contents,
  };
}
