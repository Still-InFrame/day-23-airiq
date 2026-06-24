"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiClientError, apiGet } from "@/lib/client";
import type { Language } from "@/lib/i18n";
import type {
  ApiErrorKind,
  CurrentAirQuality,
  ForecastDay,
  TrendPoint,
  WeatherContext,
} from "@/lib/types";

interface Coords {
  lat: number;
  lng: number;
}

/**
 * Orchestrates the dashboard's air-quality fetches. `current` is the primary
 * signal that drives the page's loading/error state; forecast, history, and
 * weather load in parallel and degrade silently so one failure can't blank the
 * whole dashboard.
 */
export function useAirQuality(loc: Coords | null, language: Language) {
  const [current, setCurrent] = useState<CurrentAirQuality | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [history, setHistory] = useState<TrendPoint[] | null>(null);
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState<ApiErrorKind | null>(null);

  const lat = loc?.lat;
  const lng = loc?.lng;

  const load = useCallback(async () => {
    if (lat == null || lng == null) return;
    const qs = `lat=${lat}&lng=${lng}&lang=${language}`;

    setLoading(true);
    setErrorKind(null);

    try {
      const cur = await apiGet<CurrentAirQuality>(`/api/air-quality/current?${qs}`);
      setCurrent(cur);
    } catch (err) {
      setCurrent(null);
      setForecast(null);
      setHistory(null);
      setWeather(null);
      setErrorKind(err instanceof ApiClientError ? err.kind : "server");
      setLoading(false);
      return;
    }
    setLoading(false);

    // Secondary data — best effort, never surfaces a page-level error.
    void apiGet<ForecastDay[]>(`/api/air-quality/forecast?${qs}`)
      .then(setForecast)
      .catch(() => setForecast(null));
    void apiGet<TrendPoint[]>(`/api/air-quality/history?${qs}`)
      .then(setHistory)
      .catch(() => setHistory(null));
    void apiGet<WeatherContext>(`/api/weather?${qs}`)
      .then(setWeather)
      .catch(() => setWeather(null));
  }, [lat, lng, language]);

  useEffect(() => {
    void load();
  }, [load]);

  return { current, forecast, history, weather, loading, errorKind, reload: load };
}
