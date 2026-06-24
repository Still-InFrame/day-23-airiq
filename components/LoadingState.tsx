import { Card } from "@/components/Card";
import type { Dict } from "@/lib/i18n";

/** Skeleton placeholders shown while the primary air-quality fetch is in flight. */
export function LoadingState({ dict }: { dict: Dict }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label={dict.loading}>
      <Card className="animate-pulse">
        <div className="flex items-center gap-5">
          <div className="h-24 w-24 rounded-full bg-border" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 rounded bg-border" />
            <div className="h-6 w-2/3 rounded bg-border" />
            <div className="h-4 w-1/2 rounded bg-border" />
          </div>
        </div>
      </Card>
      <Card className="animate-pulse space-y-3">
        <div className="h-4 w-1/4 rounded bg-border" />
        <div className="h-4 w-full rounded bg-border" />
        <div className="h-4 w-5/6 rounded bg-border" />
      </Card>
      <p className="text-center text-sm text-muted">{dict.loading}</p>
    </div>
  );
}
