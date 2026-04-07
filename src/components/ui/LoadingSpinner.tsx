"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[var(--color-brand)]" />
      <p className="mt-4 text-sm text-[var(--color-ink-500)]">Mengambil data terbaru...</p>
    </div>
  );
}
