"use client";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs">
      <p className="font-bold text-red-400">Gagal memuat data</p>
      <p className="mt-1 leading-5 text-red-400/70">{message}</p>
    </div>
  );
}
