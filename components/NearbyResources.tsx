import { Card, SectionTitle } from "@/components/Card";
import type { Dict } from "@/lib/i18n";
import type { NearbyCategory, NearbyPlace } from "@/lib/types";

const CATEGORY_ORDER: NearbyCategory[] = ["clinic", "pharmacy", "community", "library"];

export function NearbyResources({
  dict,
  places,
}: {
  dict: Dict;
  places: NearbyPlace[] | null;
}) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: (places ?? []).filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <Card>
      <SectionTitle>{dict.nearby.title}</SectionTitle>
      <p className="-mt-2 mb-3 text-sm text-muted">{dict.nearby.subtitle}</p>

      {places === null ? (
        <div className="space-y-2" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-border" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-muted">{dict.nearby.noData}</p>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                {dict.nearby.categories[cat]}
              </p>
              <ul className="space-y-2">
                {items.slice(0, 5).map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{p.name}</p>
                      {p.address && <p className="truncate text-xs text-muted">{p.address}</p>}
                      {p.openNow != null && (
                        <span
                          className={`mt-1 inline-block text-xs font-medium ${
                            p.openNow ? "text-aqi-good" : "text-muted"
                          }`}
                        >
                          {p.openNow ? dict.nearby.openNow : dict.nearby.closed}
                        </span>
                      )}
                    </div>
                    {p.mapsUri && (
                      <a
                        href={p.mapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm font-semibold text-accent underline underline-offset-2"
                      >
                        {dict.nearby.directions}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
