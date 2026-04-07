import { NextRequest, NextResponse } from "next/server";
import { getInstagramProfile } from "@/lib/instagram";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Parameter 'username' wajib diisi" }, { status: 400 });
  }
  try {
    const data = await getInstagramProfile(username);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
