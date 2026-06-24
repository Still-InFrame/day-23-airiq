"use client";

import { useEffect, useRef, useState } from "react";
import { AQICard } from "@/components/AQICard";
import { AirQualityMap } from "@/components/AirQualityMap";
import { Disclaimer } from "@/components/Disclaimer";
import { ErrorState } from "@/components/ErrorState";
import { ForecastStrip } from "@/components/ForecastStrip";
import { HealthGuidance } from "@/components/HealthGuidance";
import { LoadingState } from "@/components/LoadingState";
import { NearbyResources } from "@/components/NearbyResources";
import { PollutantBreakdown } from "@/components/PollutantBreakdown";
import { SavedLocationBanner } from "@/components/SavedLocationBanner";
import { SettingsPanel } from "@/components/SettingsPanel";
import { TrendChart } from "@/components/TrendChart";
import { WeatherContext } from "@/components/WeatherContext";
import { WildfireCallout } from "@/components/WildfireCallout";
import { ZipSearch } from "@/components/ZipSearch";
import { useAirQuality } from "@/hooks/useAirQuality";
import { useLanguage } from "@/hooks/useLanguage";
import { useNearby } from "@/hooks/useNearby";
import { useSavedLocation } from "@/hooks/useSavedLocation";
import { useUserGroup } from "@/hooks/useUserGroup";
import { categoryMeta } from "@/lib/aqi";
import { ApiClientError, apiGet } from "@/lib/client";
import { getDict } from "@/lib/i18n";
import { clearAll, setLastViewedAt } from "@/lib/storage";
import type { ApiErrorKind, GeocodeResult } from "@/lib/types";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { userGroup, setUserGroup } = useUserGroup();
  const { saved, hydrated, save, clear } = useSavedLocation();
  const dict = getDict(language);

  const [active, setActive] = useState<GeocodeResult | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geoError, setGeoError] = useState<ApiErrorKind | null>(null);
  const [savePromptDismissed, setSavePromptDismissed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const didAutoLoad = useRef(false);

  // Auto-load the saved location once on first visit of the session.
  useEffect(() => {
    if (hydrated && saved && !didAutoLoad.current) {
      didAutoLoad.current = true;
      setActive({ zip: saved.zip, lat: saved.lat, lng: saved.lng, label: saved.label });
    }
  }, [hydrated, saved]);

  const aq = useAirQuality(active, language);
  const places = useNearby(aq.current ? active : null);

  useEffect(() => {
    if (aq.current) setLastViewedAt(new Date().toISOString());
  }, [aq.current]);

  async function handleZip(zip: string) {
    setGeocoding(true);
    setGeoError(null);
    try {
      const result = await apiGet<GeocodeResult>(`/api/geocode?zip=${zip}`);
      setActive(result);
      setSavePromptDismissed(false);
    } catch (err) {
      setGeoError(err instanceof ApiClientError ? err.kind : "server");
    } finally {
      setGeocoding(false);
    }
  }

  function handleChangeLocation() {
    setActive(null);
    setGeoError(null);
  }

  function handleResetAll() {
    clearAll();
    window.location.reload();
  }

  const isSavedActive = !!saved && !!active && saved.zip === active.zip;
  const showSavePrompt = !!active && !isSavedActive && !savePromptDismissed && !!aq.current;
  const severity = aq.current ? categoryMeta(aq.current.categoryKey).severity : "reassure";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-fg">
            A
          </span>
          <div>
            <p className="text-lg font-bold leading-none text-foreground">{dict.appName}</p>
            <p className="text-xs text-muted">{dict.tagline}</p>
          </div>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          aria-label={dict.settings.title}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition hover:bg-background"
        >
          {dict.settings.open}
        </button>
      </header>

      {/* No location yet: show the search hero. */}
      {!active && (
        <div className="mt-6">
          <ZipSearch dict={dict} onSubmit={handleZip} loading={geocoding} />
          {geoError && (
            <div className="mt-4">
              <ErrorState dict={dict} kind={geoError} />
            </div>
          )}
        </div>
      )}

      {/* A location is active: show the dashboard. */}
      {active && (
        <>
          <SavedLocationBanner
            dict={dict}
            label={active.label}
            updatedAt={aq.current?.dateTime ?? null}
            lang={language}
            onRefresh={aq.reload}
            onChange={handleChangeLocation}
            showSavePrompt={showSavePrompt}
            onSave={() => save(active)}
            onDismissSave={() => setSavePromptDismissed(true)}
          />

          {aq.loading && !aq.current && <LoadingState dict={dict} />}

          {aq.errorKind && !aq.loading && (
            <ErrorState dict={dict} kind={aq.errorKind} onRetry={aq.reload} />
          )}

          {aq.current && (
            <>
              <AQICard dict={dict} data={aq.current} lang={language} />
              <HealthGuidance dict={dict} data={aq.current} userGroup={userGroup} />
              <PollutantBreakdown
                dict={dict}
                pollutants={aq.current.pollutants}
                dominant={aq.current.dominantPollutant}
              />
              <WeatherContext dict={dict} weather={aq.weather} />
              <ForecastStrip dict={dict} days={aq.forecast} />
              <TrendChart dict={dict} points={aq.history} lang={language} />
              <AirQualityMap
                dict={dict}
                center={{ lat: active.lat, lng: active.lng }}
                places={places ?? []}
              />
              <NearbyResources dict={dict} places={places} />
              <WildfireCallout dict={dict} emphasized={severity !== "reassure"} />
            </>
          )}
        </>
      )}

      <div className="mt-2">
        <Disclaimer dict={dict} />
      </div>

      <SettingsPanel
        dict={dict}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userGroup={userGroup}
        onUserGroup={setUserGroup}
        language={language}
        onLanguage={setLanguage}
        saved={saved}
        onClearLocation={clear}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
