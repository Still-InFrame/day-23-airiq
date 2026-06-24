import type { Dict } from "@/lib/i18n";

/** Always-visible reminder that AirIQ is awareness/planning, not medical advice. */
export function Disclaimer({ dict }: { dict: Dict }) {
  return (
    <p className="px-1 text-center text-xs leading-relaxed text-muted">
      {dict.disclaimer}
    </p>
  );
}
