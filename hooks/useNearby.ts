"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/client";
import type { NearbyPlace } from "@/lib/types";

interface Coords {
  lat: number;
  lng: number;
}

/** Best-effort fetch of nearby support places. Null = loading, [] = none/failed. */
export function useNearby(loc: Coords | null) {
  const [places, setPlaces] = useState<NearbyPlace[] | null>(null);
  const lat = loc?.lat;
  const lng = loc?.lng;

  useEffect(() => {
    if (lat == null || lng == null) {
      setPlaces(null);
      return;
    }
    let cancelled = false;
    setPlaces(null);
    apiGet<NearbyPlace[]>(`/api/places/nearby?lat=${lat}&lng=${lng}`)
      .then((data) => {
        if (!cancelled) setPlaces(data);
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return places;
}
