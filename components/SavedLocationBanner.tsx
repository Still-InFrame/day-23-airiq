"use client";

import { formatDateTime } from "@/lib/format";
import type { Dict, Language } from "@/lib/i18n";

export function SavedLocationBanner({
  dict,
  label,
  updatedAt,
  lang,
  onRefresh,
  onChange,
  showSavePrompt,
  onSave,
  onDismissSave,
}: {
  dict: Dict;
  label: string;
  updatedAt: string | null;
  lang: Language;
  onRefresh: () => void;
  onChange: () => void;
  showSavePrompt: boolean;
  onSave: () => void;
  onDismissSave: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-foreground">{label}</p>
          {updatedAt && (
            <p className="text-xs text-muted">
              {dict.banner.updated}: {formatDateTime(updatedAt, lang)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-background"
          >
            {dict.banner.refresh}
          </button>
          <button
            onClick={onChange}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-background"
          >
            {dict.banner.change}
          </button>
        </div>
      </div>

      {showSavePrompt && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <p className="text-sm font-medium text-foreground">{dict.banner.savePrompt}</p>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
            >
              {dict.banner.save}
            </button>
            <button
              onClick={onDismissSave}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:text-foreground"
            >
              {dict.banner.notNow}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
