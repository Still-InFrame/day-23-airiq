import { NextResponse } from "next/server";
import { resolveError, searchNearby } from "@/lib/google";
import { parseLocation } from "@/lib/params";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { lat, lng } = parseLocation(req);
    const data = await searchNearby(lat, lng);
    return NextResponse.json(data);
  } catch (err) {
    const { status, body } = resolveError(err);
    return NextResponse.json(body, { status });
  }
}
