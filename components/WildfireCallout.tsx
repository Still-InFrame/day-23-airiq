import clsx from "clsx";
import type { Dict } from "@/lib/i18n";

/**
 * Points users to official local alerts during smoke/wildfire events. Always
 * present; emphasized when the air is unhealthy so it stands out when it matters.
 */
export function WildfireCallout({
  dict,
  emphasized = false,
}: {
  dict: Dict;
  emphasized?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-4",
        emphasized
          ? "border-aqi-usg bg-aqi-usg-soft"
          : "border-border bg-surface",
      )}
    >
      <p className="font-semibold text-foreground">{dict.wildfire.title}</p>
      <p className="mt-1 text-sm text-muted">{dict.wildfire.text}</p>
      <a
        href="https://fire.airnow.gov/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-semibold text-accent underline underline-offset-2"
      >
        {dict.wildfire.link} ↗
      </a>
    </div>
  );
}
