import type { Language } from "@/lib/i18n";

const LOCALE: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
};

export function formatDateTime(iso: string, lang: Language): string {
  try {
    return new Intl.DateTimeFormat(LOCALE[lang], {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatTime(iso: string, lang: Language): string {
  try {
    return new Intl.DateTimeFormat(LOCALE[lang], { timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Round a pollutant concentration for display (1 decimal, no trailing .0). */
export function formatConcentration(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function weekdayIndex(dateStr: string): number {
  // dateStr is yyyy-mm-dd; build a local date to read the weekday.
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).getDay();
}
