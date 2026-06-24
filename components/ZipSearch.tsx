"use client";

import { useState, type FormEvent } from "react";
import type { Dict } from "@/lib/i18n";

export function ZipSearch({
  dict,
  onSubmit,
  loading = false,
  compact = false,
}: {
  dict: Dict;
  onSubmit: (zip: string) => void;
  loading?: boolean;
  compact?: boolean;
}) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = zip.trim();
    if (!/^\d{5}$/.test(trimmed)) {
      setError(dict.search.invalid);
      return;
    }
    setError(null);
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {!compact && (
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {dict.search.title}
        </h1>
      )}
      {!compact && <p className="mb-5 text-muted">{dict.tagline}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, ""))}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.placeholder}
          aria-invalid={!!error}
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-lg text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-accent-fg transition hover:opacity-90 disabled:opacity-60"
        >
          {dict.search.button}
        </button>
      </div>

      <p className={`mt-2 text-sm ${error ? "text-aqi-unhealthy" : "text-muted"}`}>
        {error ?? dict.search.helper}
      </p>
    </form>
  );
}
