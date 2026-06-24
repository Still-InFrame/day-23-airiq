import type { AqiCategoryKey } from "@/lib/types";

/**
 * AQI category logic. Text (labels, "what this means", actions) lives in i18n so it
 * can be localized; this module owns only the non-text logic: number -> category,
 * category -> colors, and severity level used to set the page's tone.
 */

export type Severity = "reassure" | "caution" | "warn";

export interface CategoryMeta {
  key: AqiCategoryKey;
  /** Tailwind classes wired to the AQI theme tokens in globals.css. */
  color: string; // solid color (text/border accents)
  textOn: string; // text color to place on the solid color
  soft: string; // soft tint background
  severity: Severity;
}

const META: Record<AqiCategoryKey, CategoryMeta> = {
  good: {
    key: "good",
    color: "text-aqi-good",
    textOn: "text-white",
    soft: "bg-aqi-good-soft",
    severity: "reassure",
  },
  moderate: {
    key: "moderate",
    color: "text-aqi-moderate",
    textOn: "text-white",
    soft: "bg-aqi-moderate-soft",
    severity: "reassure",
  },
  usg: {
    key: "usg",
    color: "text-aqi-usg",
    textOn: "text-white",
    soft: "bg-aqi-usg-soft",
    severity: "caution",
  },
  unhealthy: {
    key: "unhealthy",
    color: "text-aqi-unhealthy",
    textOn: "text-white",
    soft: "bg-aqi-unhealthy-soft",
    severity: "warn",
  },
  "very-unhealthy": {
    key: "very-unhealthy",
    color: "text-aqi-very-unhealthy",
    textOn: "text-white",
    soft: "bg-aqi-very-unhealthy-soft",
    severity: "warn",
  },
  hazardous: {
    key: "hazardous",
    color: "text-aqi-hazardous",
    textOn: "text-white",
    soft: "bg-aqi-hazardous-soft",
    severity: "warn",
  },
  unknown: {
    key: "unknown",
    color: "text-aqi-unknown",
    textOn: "text-white",
    soft: "bg-aqi-unknown-soft",
    severity: "caution",
  },
};

/** Background colors keyed by category, for solid fills (markers, dots, bars). */
export const AQI_HEX: Record<AqiCategoryKey, string> = {
  good: "#2e8b57",
  moderate: "#c9a227",
  usg: "#e07b39",
  unhealthy: "#d24b4b",
  "very-unhealthy": "#8e4da3",
  hazardous: "#7e2230",
  unknown: "#6b6a67",
};

export function categoryMeta(key: AqiCategoryKey): CategoryMeta {
  return META[key];
}

/** US EPA AQI breakpoints (0-500 scale; higher is worse). */
export function categoryFromUsAqi(aqi: number | null | undefined): AqiCategoryKey {
  if (aqi == null || Number.isNaN(aqi)) return "unknown";
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "usg";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "very-unhealthy";
  return "hazardous";
}

/**
 * Fallback when only Google's category text is available (e.g. the universal AQI
 * index for a non-US location). Matches on keywords across en/es/fr.
 */
export function categoryFromText(text: string | null | undefined): AqiCategoryKey {
  if (!text) return "unknown";
  const t = text.toLowerCase();
  if (/(hazard|peligros|dangereu)/.test(t)) return "hazardous";
  if (/(very unhealthy|muy insalubre|tr[eè]s mauvais)/.test(t)) return "very-unhealthy";
  if (/(sensitive|sensibles|sensibles)/.test(t)) return "usg";
  if (/(unhealthy|insalubre|mauvais)/.test(t)) return "unhealthy";
  if (/(moderate|moderad|moyen)/.test(t)) return "moderate";
  if (/(good|excellent|buen|bonne|excelente)/.test(t)) return "good";
  return "unknown";
}

/**
 * Pick a category. Prefer the numeric US AQI breakpoints; fall back to Google's
 * localized category text when the index is not the US scale.
 */
export function resolveCategory(
  aqi: number | null,
  indexCode: string,
  categoryText: string | null,
): AqiCategoryKey {
  if (indexCode === "usa_epa") return categoryFromUsAqi(aqi);
  return categoryFromText(categoryText);
}
