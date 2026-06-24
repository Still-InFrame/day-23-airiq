import { NextResponse } from "next/server";
import { GoogleApiError, geocodeZip, resolveError } from "@/lib/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const zip = new URL(req.url).searchParams.get("zip")?.trim() ?? "";

  if (!/^\d{5}$/.test(zip)) {
    const { status, body } = resolveError(
      new GoogleApiError("invalid_zip", "Enter a valid 5-digit US ZIP code.", 400),
    );
    return NextResponse.json(body, { status });
  }

  try {
    const result = await geocodeZip(zip);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = resolveError(err);
    return NextResponse.json(body, { status });
  }
}
