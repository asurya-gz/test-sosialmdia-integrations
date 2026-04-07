"use client";

import Image from "next/image";
import { ContentItem } from "@/types";
import { formatViewCount, formatDate, getProxyImageUrl } from "@/lib/utils";

interface ContentListProps {
  contents: ContentItem[];
}

export function ContentList({ contents }: ContentListProps) {
  if (!contents.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center">
        <p className="text-xs text-white/30">Belum ada konten untuk ditampilkan</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {contents.map((item) => {
        const thumbnailUrl = getProxyImageUrl(item.thumbnailUrl);

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 transition hover:border-white/[0.12] hover:bg-white/[0.07]"
          >
            <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
              {thumbnailUrl ? (
                <Image src={thumbnailUrl} alt={item.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-white/20">
                  —
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium text-white/60 transition group-hover:text-white/90">
                {item.title}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-white/35">
                  {formatViewCount(item.viewCount)} views
                </span>
                <span className="text-white/15">·</span>
                <span className="text-[10px] text-white/25">{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
