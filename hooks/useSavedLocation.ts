"use client";

import { useCallback, useEffect, useState } from "react";
import type { GeocodeResult, SavedLocation } from "@/lib/types";
import {
  clearSavedLocation,
  getSavedLocation,
  setSavedLocation,
  setLastViewedAt,
} from "@/lib/storage";

/**
 * Manages the saved location in localStorage. `hydrated` flips true after the
 * first client read so the UI can wait before deciding to show the search screen.
 */
export function useSavedLocation() {
  const [saved, setSaved] = useState<SavedLocation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(getSavedLocation());
    setHydrated(true);
  }, []);

  const save = useCallback((loc: GeocodeResult) => {
    const record: SavedLocation = { ...loc, savedAt: new Date().toISOString() };
    setSavedLocation(record);
    setLastViewedAt(record.savedAt);
    setSaved(record);
  }, []);

  const clear = useCallback(() => {
    clearSavedLocation();
    setSaved(null);
  }, []);

  return { saved, hydrated, save, clear };
}
