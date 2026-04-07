"use client";

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefreshButton({ onRefresh, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-white/40 transition hover:border-white/[0.15] hover:bg-white/[0.09] hover:text-white/70 disabled:opacity-30"
    >
      <svg
        className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Refresh
    </button>
  );
}
