import type { SavedLocation } from "@/lib/types";
import { DEFAULT_USER_GROUP, isUserGroupId, type UserGroupId } from "@/lib/userGroups";
import { DEFAULT_LANGUAGE, isLanguage, type Language } from "@/lib/i18n";

/**
 * Typed, SSR-safe wrappers over localStorage. All reads/writes are guarded so they
 * are no-ops on the server and never throw if storage is unavailable (private mode,
 * quota, etc.).
 */

export const STORAGE_KEYS = {
  savedLocation: "airiq.savedLocation",
  userGroup: "airiq.userGroup",
  language: "airiq.language",
  lastViewedAt: "airiq.lastViewedAt",
} as const;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readRaw(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private-mode errors */
  }
}

function removeRaw(key: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getSavedLocation(): SavedLocation | null {
  const raw = readRaw(STORAGE_KEYS.savedLocation);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SavedLocation>;
    if (
      typeof parsed.zip === "string" &&
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number"
    ) {
      return {
        zip: parsed.zip,
        lat: parsed.lat,
        lng: parsed.lng,
        label: parsed.label ?? parsed.zip,
        savedAt: parsed.savedAt ?? new Date().toISOString(),
      };
    }
  } catch {
    /* fall through */
  }
  return null;
}

export function setSavedLocation(loc: SavedLocation): void {
  writeRaw(STORAGE_KEYS.savedLocation, JSON.stringify(loc));
}

export function clearSavedLocation(): void {
  removeRaw(STORAGE_KEYS.savedLocation);
}

export function getUserGroup(): UserGroupId {
  const raw = readRaw(STORAGE_KEYS.userGroup);
  return isUserGroupId(raw) ? raw : DEFAULT_USER_GROUP;
}

export function setUserGroup(group: UserGroupId): void {
  writeRaw(STORAGE_KEYS.userGroup, group);
}

export function getLanguage(): Language {
  const raw = readRaw(STORAGE_KEYS.language);
  return isLanguage(raw) ? raw : DEFAULT_LANGUAGE;
}

export function setLanguage(lang: Language): void {
  writeRaw(STORAGE_KEYS.language, lang);
}

export function getLastViewedAt(): string | null {
  return readRaw(STORAGE_KEYS.lastViewedAt);
}

export function setLastViewedAt(iso: string): void {
  writeRaw(STORAGE_KEYS.lastViewedAt, iso);
}

/** Clear all AirIQ data (used by the "reset" action in Settings). */
export function clearAll(): void {
  Object.values(STORAGE_KEYS).forEach(removeRaw);
}
