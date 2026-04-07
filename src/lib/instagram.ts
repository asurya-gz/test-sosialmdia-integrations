import { ContentItem, PlatformProfile } from "@/types";

const PRIMARY_RAPID_API_HOST = "instagram-public-bulk-scraper.p.rapidapi.com";
const FALLBACK_RAPID_API_HOST = "instagram120.p.rapidapi.com";
const MAX_INSTAGRAM_PAGES = 20;

type UnknownRecord = Record<string, unknown>;

type Instagram120User = {
  username?: string;
  full_name?: string;
  profile_pic_url?: string;
  hd_profile_pic_url_info?: {
    url?: string;
  };
};

type Instagram120Node = {
  pk: string;
  code: string;
  caption?: {
    text?: string;
  };
  image_versions2?: {
    candidates?: Array<{
      url?: string;
    }>;
  };
  user?: Instagram120User;
  owner?: Instagram120User;
  taken_at?: number;
  view_count?: number | null;
  play_count?: number | null;
};

type Instagram120Response = {
  result?: {
    edges?: Array<{
      node?: Instagram120Node;
    }>;
    page_info?: {
      end_cursor?: string;
      has_next_page?: boolean;
    };
  };
  message?: string;
};

function getRapidApiKey() {
  if (!process.env.RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY belum diatur di environment variable.");
  }

  return process.env.RAPIDAPI_KEY;
}

function getRapidApiHeaders(host: string) {
  return {
    "x-rapidapi-key": getRapidApiKey(),
    "x-rapidapi-host": host,
    "Content-Type": "application/json",
  };
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getNestedRecord(source: unknown, key: string): UnknownRecord | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const value = source[key];
  return isRecord(value) ? value : undefined;
}

function getNestedArray(source: unknown, key: string): unknown[] | undefined {
  if (!isRecord(source)) {
    return undefined;
  }

  const value = source[key];
  return Array.isArray(value) ? value : undefined;
}

function normalizeCursor(cursor?: string) {
  if (!cursor || cursor === "None") {
    return "";
  }

  return cursor;
}

function buildInstagramPostUrl(post: UnknownRecord): string {
  const permalink = getString(post.permalink);
  if (permalink) {
    return permalink;
  }

  const shortcode = getString(post.shortcode) ?? getString(post.code);
  if (shortcode) {
    return `https://instagram.com/p/${shortcode}`;
  }

  return "https://instagram.com/";
}

function resolveInstagramCaption(post: UnknownRecord): string {
  const caption = post.caption;

  if (typeof caption === "string" && caption.trim()) {
    return caption.slice(0, 80);
  }

  if (isRecord(caption)) {
    const text = getString(caption.text);
    if (text) {
      return text.slice(0, 80);
    }
  }

  const title = getString(post.title);
  if (title) {
    return title.slice(0, 80);
  }

  return "(Tanpa Caption)";
}

function resolveInstagramThumbnail(post: UnknownRecord): string {
  const imageVersions = getNestedRecord(post, "image_versions2");
  const candidates = imageVersions ? getNestedArray(imageVersions, "candidates") : undefined;
  const firstCandidate = Array.isArray(candidates) ? candidates[0] : undefined;

  if (isRecord(firstCandidate)) {
    const candidateUrl = getString(firstCandidate.url);
    if (candidateUrl) {
      return candidateUrl;
    }
  }

  return (
    getString(post.thumbnail_url) ??
    getString(post.display_url) ??
    getString(post.image_url) ??
    getString(post.image_versions) ??
    ""
  );
}

function resolveInstagramPublishedAt(post: UnknownRecord): string {
  const takenAt = getNumber(post.taken_at) ?? getNumber(post.timestamp) ?? getNumber(post.created_at);

  if (takenAt) {
    const millis = takenAt > 9_999_999_999 ? takenAt : takenAt * 1000;
    return new Date(millis).toISOString();
  }

  return new Date(0).toISOString();
}

function resolveInstagramViewCount(post: UnknownRecord): number {
  return (
    getNumber(post.view_count) ??
    getNumber(post.play_count) ??
    getNumber(post.video_view_count) ??
    0
  );
}

function normalizeBulkPost(post: unknown): ContentItem | null {
  if (!isRecord(post)) {
    return null;
  }

  const id = getString(post.pk) ?? getString(post.id) ?? getString(post.code) ?? getString(post.shortcode);
  if (!id) {
    return null;
  }

  return {
    id,
    title: resolveInstagramCaption(post),
    thumbnailUrl: resolveInstagramThumbnail(post),
    viewCount: resolveInstagramViewCount(post),
    url: buildInstagramPostUrl(post),
    publishedAt: resolveInstagramPublishedAt(post),
  };
}

function extractBulkProfileCandidate(json: unknown): UnknownRecord | undefined {
  if (!isRecord(json)) {
    return undefined;
  }

  return (
    getNestedRecord(json, "user") ??
    getNestedRecord(json, "profile") ??
    getNestedRecord(json, "data") ??
    getNestedRecord(getNestedRecord(json, "data"), "user") ??
    getNestedRecord(getNestedRecord(json, "result"), "user") ??
    getNestedRecord(json, "result") ??
    undefined
  );
}

function extractBulkPosts(json: unknown): ContentItem[] {
  if (!isRecord(json)) {
    return [];
  }

  const candidates = [
    getNestedArray(json, "items"),
    getNestedArray(json, "posts"),
    getNestedArray(getNestedRecord(json, "data"), "items"),
    getNestedArray(getNestedRecord(json, "data"), "posts"),
    getNestedArray(getNestedRecord(json, "result"), "items"),
    getNestedArray(getNestedRecord(json, "result"), "posts"),
  ];

  const rawPosts = candidates.find(Array.isArray) ?? [];

  return rawPosts
    .map((post) => normalizeBulkPost(post))
    .filter((post): post is ContentItem => Boolean(post));
}

function extractBulkNextCursor(json: unknown): string {
  if (!isRecord(json)) {
    return "";
  }

  return normalizeCursor(
    getString(json.max_id) ??
      getString(json.next_max_id) ??
      getString(json.next_cursor) ??
      getString(json.pagination_token) ??
      getString(getNestedRecord(json, "page_info")?.end_cursor) ??
      getString(getNestedRecord(json, "result")?.next_max_id) ??
      getString(getNestedRecord(json, "data")?.next_max_id),
  );
}

function extractBulkHasMore(json: unknown): boolean {
  if (!isRecord(json)) {
    return false;
  }

  const flags = [
    json.has_more,
    json.has_next_page,
    getNestedRecord(json, "page_info")?.has_next_page,
    getNestedRecord(json, "result")?.has_next_page,
    getNestedRecord(json, "data")?.has_next_page,
  ];

  return flags.some((value) => value === true);
}

async function fetchPrimaryInstagramJson(endpoint: string) {
  const res = await fetch(`https://${PRIMARY_RAPID_API_HOST}${endpoint}`, {
    method: "GET",
    headers: getRapidApiHeaders(PRIMARY_RAPID_API_HOST),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as UnknownRecord | null;
  const providerMessage = getString(json?.message);

  if (!res.ok) {
    throw new Error(providerMessage || `Instagram provider utama gagal (${res.status}).`);
  }

  return json;
}

async function getInstagramProfileFromPrimaryProvider(username: string): Promise<PlatformProfile> {
  const infoJson = await fetchPrimaryInstagramJson(
    `/v1/user_info?username_or_id=${encodeURIComponent(username)}`,
  );

  const contents: ContentItem[] = [];
  const seenIds = new Set<string>();
  let nextCursor = "";
  let page = 0;

  while (page < MAX_INSTAGRAM_PAGES) {
    const query = new URLSearchParams({ username_or_id: username });
    if (nextCursor) {
      query.set("max_id", nextCursor);
    }

    const postsJson = await fetchPrimaryInstagramJson(`/v1/user_posts?${query.toString()}`);
    const pagePosts = extractBulkPosts(postsJson);

    pagePosts.forEach((post) => {
      if (!seenIds.has(post.id)) {
        seenIds.add(post.id);
        contents.push(post);
      }
    });

    page += 1;

    const cursor = extractBulkNextCursor(postsJson);
    const hasMore = extractBulkHasMore(postsJson);

    if (!pagePosts.length || !hasMore || !cursor) {
      break;
    }

    nextCursor = cursor;
  }

  const profile = extractBulkProfileCandidate(infoJson);

  if (!profile) {
    throw new Error("Akun Instagram tidak ditemukan.");
  }

  if (!contents.length) {
    throw new Error("Provider Instagram utama belum mengembalikan konten yang bisa dipakai.");
  }

  return {
    platform: "instagram",
    username: getString(profile.username) ?? username,
    displayName: getString(profile.full_name) ?? getString(profile.username) ?? username,
    profileImageUrl:
      getString(getNestedRecord(profile, "hd_profile_pic_url_info")?.url) ??
      getString(profile.profile_pic_url) ??
      "",
    totalViews: contents.reduce((sum, post) => sum + post.viewCount, 0),
    contents: contents.slice(0, 5),
  };
}

function mapInstagram120NodeToContentItem(node: Instagram120Node): ContentItem {
  return {
    id: node.pk,
    title: node.caption?.text?.slice(0, 80) || "(Tanpa Caption)",
    thumbnailUrl: node.image_versions2?.candidates?.[0]?.url ?? "",
    viewCount: node.view_count ?? node.play_count ?? 0,
    url: `https://instagram.com/p/${node.code}`,
    publishedAt: new Date((node.taken_at ?? 0) * 1000).toISOString(),
  };
}

async function fetchFallbackInstagramPosts(username: string, maxId = "") {
  const res = await fetch(`https://${FALLBACK_RAPID_API_HOST}/api/instagram/posts`, {
    method: "POST",
    headers: getRapidApiHeaders(FALLBACK_RAPID_API_HOST),
    body: JSON.stringify({
      username,
      maxId,
    }),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as Instagram120Response | null;

  if (!res.ok) {
    const providerMessage = json?.message;

    if (res.status === 429) {
      throw new Error(
        providerMessage || "Instagram API sedang mencapai batas request atau quota plan sudah habis.",
      );
    }

    if (res.status === 403) {
      throw new Error(
        providerMessage || "Akses ke Instagram API ditolak. Periksa subscription RapidAPI.",
      );
    }

    throw new Error(providerMessage || "Gagal mengambil data Instagram.");
  }

  return json;
}

async function getInstagramProfileFromFallbackProvider(username: string): Promise<PlatformProfile> {
  const posts: Instagram120Node[] = [];
  const seenIds = new Set<string>();
  let maxId = "";
  let page = 0;

  while (page < MAX_INSTAGRAM_PAGES) {
    const json = await fetchFallbackInstagramPosts(username, maxId);
    const edges = json?.result?.edges ?? [];
    const pagePosts = edges
      .map((edge) => edge.node)
      .filter((node): node is Instagram120Node => Boolean(node?.pk));

    pagePosts.forEach((post) => {
      if (!seenIds.has(post.pk)) {
        seenIds.add(post.pk);
        posts.push(post);
      }
    });

    page += 1;

    const nextCursor = normalizeCursor(json?.result?.page_info?.end_cursor);
    const hasNextPage = Boolean(json?.result?.page_info?.has_next_page);

    if (!pagePosts.length || !hasNextPage || !nextCursor) {
      break;
    }

    maxId = nextCursor;
  }

  const profileUser = posts[0]?.user ?? posts[0]?.owner;

  if (!profileUser && !posts.length) {
    throw new Error("Akun Instagram tidak ditemukan atau belum memiliki konten publik.");
  }

  const contents = posts.slice(0, 5).map(mapInstagram120NodeToContentItem);
  const totalViews = posts.reduce(
    (sum, post) => sum + (post.view_count ?? post.play_count ?? 0),
    0,
  );

  return {
    platform: "instagram",
    username: profileUser?.username || username,
    displayName: profileUser?.full_name || profileUser?.username || username,
    profileImageUrl:
      profileUser?.hd_profile_pic_url_info?.url ?? profileUser?.profile_pic_url ?? "",
    totalViews,
    contents,
  };
}

export async function getInstagramProfile(username: string): Promise<PlatformProfile> {
  const normalizedUsername = username.trim().replace(/^@/, "");

  try {
    return await getInstagramProfileFromPrimaryProvider(normalizedUsername);
  } catch (primaryError) {
    try {
      return await getInstagramProfileFromFallbackProvider(normalizedUsername);
    } catch (fallbackError) {
      const primaryMessage =
        primaryError instanceof Error ? primaryError.message : "Provider utama gagal.";
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : "Provider fallback gagal.";

      throw new Error(`${primaryMessage} ${fallbackMessage}`.trim());
    }
  }
}
