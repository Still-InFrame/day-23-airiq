"use client";

import clsx from "clsx";
import { LANGUAGES, type Dict, type Language } from "@/lib/i18n";
import { USER_GROUP_IDS, type UserGroupId } from "@/lib/userGroups";
import type { SavedLocation } from "@/lib/types";

export function SettingsPanel({
  dict,
  open,
  onClose,
  userGroup,
  onUserGroup,
  language,
  onLanguage,
  saved,
  onClearLocation,
  onResetAll,
}: {
  dict: Dict;
  open: boolean;
  onClose: () => void;
  userGroup: UserGroupId;
  onUserGroup: (g: UserGroupId) => void;
  language: Language;
  onLanguage: (l: Language) => void;
  saved: SavedLocation | null;
  onClearLocation: () => void;
  onResetAll: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{dict.settings.title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-accent"
          >
            {dict.settings.done}
          </button>
        </div>

        {/* User group */}
        <section className="mb-6">
          <p className="font-semibold text-foreground">{dict.settings.whoLabel}</p>
          <p className="mb-3 text-sm text-muted">{dict.settings.whoHelp}</p>
          <div className="flex flex-wrap gap-2">
            {USER_GROUP_IDS.map((id) => (
              <button
                key={id}
                onClick={() => onUserGroup(id)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  id === userGroup
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-surface text-foreground hover:bg-background",
                )}
              >
                {dict.groups[id]}
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="mb-6">
          <p className="mb-3 font-semibold text-foreground">{dict.settings.languageLabel}</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => onLanguage(l.id)}
                className={clsx(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  l.id === language
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-surface text-foreground hover:bg-background",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* Saved location */}
        <section className="mb-6">
          <p className="mb-2 font-semibold text-foreground">{dict.settings.locationLabel}</p>
          {saved ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <span className="truncate text-sm text-foreground">{saved.label}</span>
              <button
                onClick={onClearLocation}
                className="shrink-0 text-sm font-semibold text-aqi-unhealthy"
              >
                {dict.settings.clearLocation}
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted">{dict.settings.noLocation}</p>
          )}
        </section>

        {/* Reset all */}
        <button
          onClick={() => {
            if (window.confirm(dict.settings.resetConfirm)) onResetAll();
          }}
          className="w-full rounded-xl border border-border py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
        >
          {dict.settings.resetAll}
        </button>
      </div>
    </div>
  );
}
