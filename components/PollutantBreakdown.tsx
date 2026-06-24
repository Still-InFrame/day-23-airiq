import clsx from "clsx";
import { Card, SectionTitle } from "@/components/Card";
import { formatConcentration } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { Pollutant } from "@/lib/types";

// Show the pollutants people recognize first; the rest follow if present.
const PRIORITY = ["pm25", "pm10", "o3", "no2", "so2", "co"];

function orderPollutants(pollutants: Pollutant[]): Pollutant[] {
  return [...pollutants].sort((a, b) => {
    const ai = PRIORITY.indexOf(a.code);
    const bi = PRIORITY.indexOf(b.code);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function PollutantBreakdown({
  dict,
  pollutants,
  dominant,
}: {
  dict: Dict;
  pollutants: Pollutant[];
  dominant: string | null;
}) {
  const ordered = orderPollutants(pollutants.filter((p) => p.value != null));

  return (
    <Card>
      <SectionTitle>{dict.pollutants.title}</SectionTitle>
      {ordered.length === 0 ? (
        <p className="text-sm text-muted">{dict.pollutants.noData}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ordered.map((p) => (
            <li
              key={p.code}
              className={clsx(
                "rounded-xl border p-3",
                p.code === dominant ? "border-accent bg-accent/5" : "border-border",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-foreground">{p.displayName}</span>
                {p.code === dominant && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-fg">
                    {dict.pollutants.main}
                  </span>
                )}
              </div>
              <p className="mt-1 text-lg font-bold text-foreground">
                {formatConcentration(p.value)}{" "}
                <span className="text-xs font-normal text-muted">{p.units}</span>
              </p>
              {p.fullName && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{p.fullName}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
