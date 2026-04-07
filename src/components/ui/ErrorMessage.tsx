"use client";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700">
      <p className="font-semibold">Gagal memuat data</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
