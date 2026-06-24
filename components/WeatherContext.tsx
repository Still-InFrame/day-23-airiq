import { Card, SectionTitle } from "@/components/Card";
import type { Dict } from "@/lib/i18n";
import type { WeatherContext as Weather } from "@/lib/types";

function fmt(value: number | null, suffix: string): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value)}${suffix}`;
}

export function WeatherContext({
  dict,
  weather,
}: {
  dict: Dict;
  weather: Weather | null;
}) {
  const hasAny =
    weather &&
    (weather.temp != null ||
      weather.windSpeed != null ||
      weather.visibility != null ||
      weather.humidity != null);

  return (
    <Card>
      <SectionTitle>{dict.weather.title}</SectionTitle>
      {!hasAny ? (
        <p className="text-sm text-muted">{dict.weather.unavailable}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label={dict.weather.feelsLike} value={fmt(weather!.feelsLike ?? weather!.temp, "°")} />
          <Metric label={dict.weather.wind} value={fmt(weather!.windSpeed, " mph")} />
          <Metric label={dict.weather.visibility} value={fmt(weather!.visibility, " mi")} />
          <Metric label={dict.weather.humidity} value={fmt(weather!.humidity, "%")} />
        </div>
      )}
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
