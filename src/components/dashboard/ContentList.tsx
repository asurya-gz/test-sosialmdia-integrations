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
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center">
        <p className="text-sm font-medium text-[var(--color-ink-950)]">Belum ada konten untuk ditampilkan</p>
        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          Akun ini belum memiliki postingan yang bisa ditarik dari platform.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contents.map((item) => {
        const thumbnailUrl = getProxyImageUrl(item.thumbnailUrl);

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/72 p-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
          >
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-medium text-slate-400">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-[var(--color-ink-950)] transition group-hover:text-[var(--color-brand)]">
                {item.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-[var(--color-ink-700)]">
                  {formatViewCount(item.viewCount)} views
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-[var(--color-ink-500)]">{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
