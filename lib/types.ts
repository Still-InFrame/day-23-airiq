/**
 * Shared types for AirIQ. The API routes normalize Google's responses into these
 * shapes so the UI never touches raw Google payloads.
 */

export type AqiCategoryKey =
  | "good"
  | "moderate"
  | "usg" // Unhealthy for Sensitive Groups
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous"
  | "unknown";

export type ApiErrorKind =
  | "invalid_zip"
  | "no_data"
  | "google_error"
  | "rate_limit"
  | "network"
  | "server";

export interface ApiErrorBody {
  error: { kind: ApiErrorKind; message: string };
}

export interface Pollutant {
  code: string; // e.g. "pm25", "pm10", "o3", "no2", "so2", "co"
  displayName: string; // e.g. "PM2.5"
  fullName: string; // e.g. "Fine particulate matter (<2.5µm)"
  value: number | null;
  units: string; // human-readable, e.g. "µg/m³" or "ppb"
}

/** Mirrors Google Air Quality healthRecommendations fields. */
export interface HealthRecommendations {
  generalPopulation?: string;
  elderly?: string;
  lungDiseasePopulation?: string;
  heartDiseasePopulation?: string;
  athletes?: string;
  pregnantWomen?: string;
  children?: string;
}

export interface CurrentAirQuality {
  dateTime: string; // ISO timestamp of the reading
  aqi: number | null;
  aqiDisplay: string;
  categoryKey: AqiCategoryKey;
  categoryLabel: string; // Google's category text (already localized)
  indexCode: string; // which index drove the number ("usa_epa" or "uaqi")
  dominantPollutant: string | null; // pollutant code
  dominantPollutantName: string | null;
  pollutants: Pollutant[];
  healthRecommendations: HealthRecommendations;
}

export interface GeocodeResult {
  zip: string;
  lat: number;
  lng: number;
  label: string; // e.g. "Los Angeles, CA 90001"
}

export interface SavedLocation extends GeocodeResult {
  savedAt: string; // ISO
}

export interface ForecastDay {
  date: string; // yyyy-mm-dd
  aqiMax: number | null;
  aqiMin: number | null;
  aqiAvg: number | null;
  categoryKey: AqiCategoryKey;
  dominantPollutant: string | null;
}

export interface TrendPoint {
  time: string; // ISO
  aqi: number | null;
}

export interface WeatherContext {
  temp: number | null; // °F (imperial)
  feelsLike: number | null; // °F
  windSpeed: number | null; // mph
  visibility: number | null; // miles
  humidity: number | null; // %
  description: string | null;
}

export type NearbyCategory = "pharmacy" | "clinic" | "library" | "community";

export interface NearbyPlace {
  id: string;
  name: string;
  category: NearbyCategory;
  address: string | null;
  lat: number;
  lng: number;
  openNow: boolean | null;
  mapsUri: string | null;
}
