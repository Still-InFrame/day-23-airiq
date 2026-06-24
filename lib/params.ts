import { GoogleApiError } from "@/lib/google";
import { isLanguage, type Language } from "@/lib/i18n";

/** Parse + validate lat/lng/lang query params shared by the air-quality routes. */
export function parseLocation(req: Request): {
  lat: number;
  lng: number;
  lang: Language;
} {
  const params = new URL(req.url).searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));
  const langRaw = params.get("lang");

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    throw new GoogleApiError("invalid_zip", "Missing or invalid coordinates.", 400);
  }

  return { lat, lng, lang: isLanguage(langRaw) ? langRaw : "en" };
}
