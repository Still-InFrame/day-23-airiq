import { resolveCategory } from "@/lib/aqi";
import type {
  ApiErrorBody,
  ApiErrorKind,
  CurrentAirQuality,
  ForecastDay,
  GeocodeResult,
  HealthRecommendations,
  NearbyCategory,
  NearbyPlace,
  Pollutant,
  TrendPoint,
  WeatherContext,
} from "@/lib/types";

/**
 * Server-side Google API helpers. These run only in API routes, so the powerful
 * GOOGLE_API_KEY never reaches the browser. Each function returns a normalized
 * shape from lib/types and throws GoogleApiError (carrying an ApiErrorKind) on
 * failure, which routes turn into a consistent JSON error envelope.
 */

export class GoogleApiError extends Error {
  kind: ApiErrorKind;
  status: number;
  constructor(kind: ApiErrorKind, message: string, status = 502) {
    super(message);
    this.name = "GoogleApiError";
    this.kind = kind;
    this.status = status;
  }
}

function serverKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new GoogleApiError(
      "server",
      "GOOGLE_API_KEY is not set. Add it to .env.local.",
      500,
    );
  }
  return key;
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 429) return "rate_limit";
  if (status >= 500) return "google_error";
  return "google_error";
}

async function postJson<T>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new GoogleApiError("network", "Network error reaching Google.", 503);
  }
  if (!res.ok) {
    throw new GoogleApiError(kindForStatus(res.status), `Google returned ${res.status}.`, 502);
  }
  return (await res.json()) as T;
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch {
    throw new GoogleApiError("network", "Network error reaching Google.", 503);
  }
  if (!res.ok) {
    throw new GoogleApiError(kindForStatus(res.status), `Google returned ${res.status}.`, 502);
  }
  return (await res.json()) as T;
}

/** Turn any thrown error into a JSON error body + HTTP status for a route. */
export function resolveError(err: unknown): { status: number; body: ApiErrorBody } {
  if (err instanceof GoogleApiError) {
    return { status: err.status, body: { error: { kind: err.kind, message: err.message } } };
  }
  return {
    status: 500,
    body: { error: { kind: "server", message: "Unexpected server error." } },
  };
}

// ---------------------------------------------------------------------------
// Geocoding
// ---------------------------------------------------------------------------

interface GeocodeResponse {
  status: string;
  results: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
}

export async function geocodeZip(zip: string): Promise<GeocodeResult> {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(zip)}` +
    `&components=country:US&key=${serverKey()}`;
  const data = await getJson<GeocodeResponse>(url);

  if (data.status === "ZERO_RESULTS") {
    throw new GoogleApiError("invalid_zip", "No location found for that ZIP code.", 404);
  }
  if (data.status === "OVER_QUERY_LIMIT") {
    throw new GoogleApiError("rate_limit", "Geocoding quota exceeded.", 429);
  }
  if (data.status !== "OK" || !data.results.length) {
    throw new GoogleApiError("google_error", `Geocoding failed (${data.status}).`, 502);
  }

  const top = data.results[0];
  const label = top.formatted_address.replace(/,\s*USA$/i, "").trim();
  return {
    zip,
    lat: top.geometry.location.lat,
    lng: top.geometry.location.lng,
    label,
  };
}

// ---------------------------------------------------------------------------
// Air Quality (shared response shapes)
// ---------------------------------------------------------------------------

interface AqIndex {
  code: string;
  displayName?: string;
  aqi?: number;
  aqiDisplay?: string;
  category?: string;
  dominantPollutant?: string;
}

interface AqPollutant {
  code: string;
  displayName?: string;
  fullName?: string;
  concentration?: { value?: number; units?: string };
}

function unitLabel(units: string | undefined): string {
  switch (units) {
    case "MICROGRAMS_PER_CUBIC_METER":
      return "µg/m³";
    case "PARTS_PER_BILLION":
      return "ppb";
    case "PARTS_PER_MILLION":
      return "ppm";
    default:
      return units ? units.toLowerCase() : "";
  }
}

/** Prefer the US EPA index; fall back to the universal AQI, then anything. */
function pickIndex(indexes: AqIndex[] | undefined): AqIndex | null {
  if (!indexes || !indexes.length) return null;
  return (
    indexes.find((i) => i.code === "usa_epa") ??
    indexes.find((i) => i.code === "uaqi") ??
    indexes[0]
  );
}

function aqiValue(idx: AqIndex | null): number | null {
  if (!idx || typeof idx.aqi !== "number") return null;
  return idx.aqi;
}

const AQ_BASE = "https://airquality.googleapis.com/v1";

const CURRENT_COMPUTATIONS = [
  "HEALTH_RECOMMENDATIONS",
  "DOMINANT_POLLUTANT_CONCENTRATION",
  "POLLUTANT_CONCENTRATION",
  "LOCAL_AQI",
  "POLLUTANT_ADDITIONAL_INFO",
];

interface CurrentResponse {
  dateTime?: string;
  indexes?: AqIndex[];
  pollutants?: AqPollutant[];
  healthRecommendations?: HealthRecommendations;
}

export async function fetchCurrent(
  lat: number,
  lng: number,
  languageCode: string,
): Promise<CurrentAirQuality> {
  const data = await postJson<CurrentResponse>(
    `${AQ_BASE}/currentConditions:lookup?key=${serverKey()}`,
    {
      location: { latitude: lat, longitude: lng },
      extraComputations: CURRENT_COMPUTATIONS,
      languageCode,
    },
  );

  const idx = pickIndex(data.indexes);
  if (!idx) {
    throw new GoogleApiError("no_data", "No air quality reading for this location.", 404);
  }

  const pollutants: Pollutant[] = (data.pollutants ?? []).map((p) => ({
    code: p.code,
    displayName: p.displayName ?? p.code.toUpperCase(),
    fullName: p.fullName ?? "",
    value: typeof p.concentration?.value === "number" ? p.concentration.value : null,
    units: unitLabel(p.concentration?.units),
  }));

  const aqi = aqiValue(idx);
  const dominantCode = idx.dominantPollutant ?? null;
  const dominantName =
    pollutants.find((p) => p.code === dominantCode)?.displayName ??
    (dominantCode ? dominantCode.toUpperCase() : null);

  return {
    dateTime: data.dateTime ?? new Date().toISOString(),
    aqi,
    aqiDisplay: idx.aqiDisplay ?? (aqi != null ? String(aqi) : "—"),
    categoryKey: resolveCategory(aqi, idx.code, idx.category ?? null),
    categoryLabel: idx.category ?? "",
    indexCode: idx.code,
    dominantPollutant: dominantCode,
    dominantPollutantName: dominantName,
    pollutants,
    healthRecommendations: data.healthRecommendations ?? {},
  };
}

// ---------------------------------------------------------------------------
// Forecast (hourly -> 4-day summary)
// ---------------------------------------------------------------------------

interface ForecastResponse {
  hourlyForecasts?: Array<{ dateTime?: string; indexes?: AqIndex[] }>;
}

export async function fetchForecast(
  lat: number,
  lng: number,
  languageCode: string,
): Promise<ForecastDay[]> {
  // Google requires startTime in the future and endTime within 96h of now, and
  // rejects the exact 96h boundary. Round start up to the next hour and cap the
  // window at 95h. pageSize covers the whole window in one response (no paging).
  const now = new Date();
  const start = new Date(Math.ceil(now.getTime() / 3_600_000) * 3_600_000);
  const end = new Date(now.getTime() + 95 * 60 * 60 * 1000);

  const data = await postJson<ForecastResponse>(
    `${AQ_BASE}/forecast:lookup?key=${serverKey()}`,
    {
      location: { latitude: lat, longitude: lng },
      extraComputations: ["LOCAL_AQI"],
      period: { startTime: start.toISOString(), endTime: end.toISOString() },
      pageSize: 96,
      languageCode,
    },
  );

  const hours = data.hourlyForecasts ?? [];
  if (!hours.length) {
    throw new GoogleApiError("no_data", "No forecast for this location.", 404);
  }

  // Bucket hourly readings by calendar date (local to the server's TZ is fine for
  // a day-level summary; the dashboard shows weekday labels).
  const byDay = new Map<string, { aqis: number[]; dominants: string[] }>();
  for (const h of hours) {
    if (!h.dateTime) continue;
    const day = h.dateTime.slice(0, 10); // yyyy-mm-dd
    const idx = pickIndex(h.indexes);
    const aqi = aqiValue(idx);
    const bucket = byDay.get(day) ?? { aqis: [], dominants: [] };
    if (aqi != null) bucket.aqis.push(aqi);
    if (idx?.dominantPollutant) bucket.dominants.push(idx.dominantPollutant);
    byDay.set(day, bucket);
  }

  const days: ForecastDay[] = [...byDay.entries()]
    .slice(0, 4)
    .map(([date, b]) => {
      const aqiMax = b.aqis.length ? Math.max(...b.aqis) : null;
      const aqiMin = b.aqis.length ? Math.min(...b.aqis) : null;
      const aqiAvg = b.aqis.length
        ? Math.round(b.aqis.reduce((s, v) => s + v, 0) / b.aqis.length)
        : null;
      return {
        date,
        aqiMax,
        aqiMin,
        aqiAvg,
        // Worst-of-day drives the category, since that's the health-relevant peak.
        categoryKey: resolveCategory(aqiMax, "usa_epa", null),
        dominantPollutant: mode(b.dominants),
      };
    });

  return days;
}

function mode(values: string[]): string | null {
  if (!values.length) return null;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

// ---------------------------------------------------------------------------
// History (last 24h trend)
// ---------------------------------------------------------------------------

interface HistoryResponse {
  hoursInfo?: Array<{ dateTime?: string; indexes?: AqIndex[] }>;
}

export async function fetchHistory(
  lat: number,
  lng: number,
  languageCode: string,
): Promise<TrendPoint[]> {
  const data = await postJson<HistoryResponse>(
    `${AQ_BASE}/history:lookup?key=${serverKey()}`,
    {
      location: { latitude: lat, longitude: lng },
      extraComputations: ["LOCAL_AQI"],
      hours: 24,
      pageSize: 24,
      languageCode,
    },
  );

  const hours = data.hoursInfo ?? [];
  if (!hours.length) {
    throw new GoogleApiError("no_data", "No recent history for this location.", 404);
  }

  return hours
    .filter((h) => h.dateTime)
    .map((h) => ({ time: h.dateTime as string, aqi: aqiValue(pickIndex(h.indexes)) }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

// ---------------------------------------------------------------------------
// Places Nearby
// ---------------------------------------------------------------------------

interface PlacesResponse {
  places?: Array<{
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude: number; longitude: number };
    currentOpeningHours?: { openNow?: boolean };
    googleMapsUri?: string;
    primaryType?: string;
    types?: string[];
  }>;
}

function categorize(primaryType: string | undefined, types: string[] = []): NearbyCategory {
  const all = [primaryType ?? "", ...types];
  if (all.some((t) => t === "pharmacy" || t === "drugstore")) return "pharmacy";
  if (all.some((t) => t === "library")) return "library";
  if (all.some((t) => t === "hospital" || t === "doctor" || t === "clinic")) return "clinic";
  return "community";
}

export async function searchNearby(lat: number, lng: number): Promise<NearbyPlace[]> {
  const data = await postJson<PlacesResponse>(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      includedTypes: ["pharmacy", "hospital", "library", "community_center"],
      maxResultCount: 20,
      locationRestriction: {
        circle: { center: { latitude: lat, longitude: lng }, radius: 8000 },
      },
    },
    {
      "X-Goog-Api-Key": serverKey(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location," +
        "places.currentOpeningHours.openNow,places.googleMapsUri,places.primaryType,places.types",
    },
  );

  return (data.places ?? [])
    .filter((p) => p.location)
    .map((p) => ({
      id: p.id,
      name: p.displayName?.text ?? "Unknown",
      category: categorize(p.primaryType, p.types),
      address: p.formattedAddress ?? null,
      lat: p.location!.latitude,
      lng: p.location!.longitude,
      openNow: p.currentOpeningHours?.openNow ?? null,
      mapsUri: p.googleMapsUri ?? null,
    }));
}

// ---------------------------------------------------------------------------
// Weather (optional context)
// ---------------------------------------------------------------------------

interface WeatherResponse {
  temperature?: { degrees?: number };
  feelsLikeTemperature?: { degrees?: number };
  relativeHumidity?: number;
  wind?: { speed?: { value?: number } };
  visibility?: { distance?: number };
  weatherCondition?: { description?: { text?: string } };
}

export async function fetchWeather(
  lat: number,
  lng: number,
  languageCode: string,
): Promise<WeatherContext> {
  const url =
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${serverKey()}` +
    `&location.latitude=${lat}&location.longitude=${lng}` +
    `&unitsSystem=IMPERIAL&languageCode=${languageCode}`;
  const data = await getJson<WeatherResponse>(url);

  return {
    temp: data.temperature?.degrees ?? null,
    feelsLike: data.feelsLikeTemperature?.degrees ?? null,
    windSpeed: data.wind?.speed?.value ?? null,
    visibility: data.visibility?.distance ?? null,
    humidity: data.relativeHumidity ?? null,
    description: data.weatherCondition?.description?.text ?? null,
  };
}
