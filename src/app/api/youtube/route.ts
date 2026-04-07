import { NextRequest, NextResponse } from "next/server";
import { getYouTubeProfile } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get("handle");
  if (!handle) {
    return NextResponse.json({ error: "Parameter 'handle' wajib diisi" }, { status: 400 });
  }
  try {
    const data = await getYouTubeProfile(handle);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    const status =
      message.includes("tidak ditemukan") || message.includes("wajib diisi") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
