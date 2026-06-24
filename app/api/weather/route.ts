import { NextResponse } from "next/server";
import { fetchWeather, resolveError } from "@/lib/google";
import { googleLanguageCode } from "@/lib/i18n";
import { parseLocation } from "@/lib/params";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { lat, lng, lang } = parseLocation(req);
    const data = await fetchWeather(lat, lng, googleLanguageCode(lang));
    return NextResponse.json(data);
  } catch (err) {
    const { status, body } = resolveError(err);
    return NextResponse.json(body, { status });
  }
}
