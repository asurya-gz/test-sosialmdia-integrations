// Utility functions

export function formatViewCount(count: number): string {
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1)}B`;
  }
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toLocaleString("id-ID");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getProxyImageUrl(url: string): string {
  if (!url) {
    return "";
  }

  if (url.startsWith("/") || url.startsWith("data:")) {
    return url;
  }

  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}
