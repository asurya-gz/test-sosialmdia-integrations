"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
      <p className="mt-3 text-xs text-white/30">Mengambil data terbaru...</p>
    </div>
  );
}
