"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import { Card, SectionTitle } from "@/components/Card";
import type { Dict } from "@/lib/i18n";
import type { NearbyPlace } from "@/lib/types";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

/**
 * Adds Google's Air Quality heatmap tiles as an overlay when enabled. Uses the
 * browser Maps key for tile requests. This is the one "if practical" feature; it
 * degrades to a plain map if tiles are unavailable.
 */
function HeatmapLayer({ enabled }: { enabled: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !enabled || typeof google === "undefined") return;
    const layer = new google.maps.ImageMapType({
      name: "AQI",
      tileSize: new google.maps.Size(256, 256),
      opacity: 0.6,
      getTileUrl: (coord, zoom) =>
        `https://airquality.googleapis.com/v1/mapTypes/US_AQI/heatmapTiles/${zoom}/${coord.x}/${coord.y}?key=${MAPS_KEY}`,
    });
    map.overlayMapTypes.insertAt(0, layer);
    return () => {
      const idx = map.overlayMapTypes.getArray().indexOf(layer);
      if (idx >= 0) map.overlayMapTypes.removeAt(idx);
    };
  }, [map, enabled]);

  return null;
}

export function AirQualityMap({
  dict,
  center,
  places = [],
}: {
  dict: Dict;
  center: { lat: number; lng: number };
  places?: NearbyPlace[];
}) {
  const [heatmap, setHeatmap] = useState(true);

  if (!MAPS_KEY) {
    return (
      <Card>
        <SectionTitle>{dict.map.title}</SectionTitle>
        <p className="text-sm text-muted">{dict.map.unavailable}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle>{dict.map.title}</SectionTitle>
        <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted">
          <input
            type="checkbox"
            checked={heatmap}
            onChange={(e) => setHeatmap(e.target.checked)}
            className="accent-accent"
          />
          {dict.map.layer}
        </label>
      </div>
      <div className="h-64 w-full overflow-hidden rounded-xl">
        <APIProvider apiKey={MAPS_KEY}>
          <Map
            defaultCenter={center}
            defaultZoom={11}
            gestureHandling="cooperative"
            disableDefaultUI
            zoomControl
            className="h-full w-full"
          >
            <Marker position={center} title={dict.map.yourLocation} />
            {places.map((p) => (
              <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }} title={p.name} />
            ))}
            <HeatmapLayer enabled={heatmap} />
          </Map>
        </APIProvider>
      </div>
    </Card>
  );
}
