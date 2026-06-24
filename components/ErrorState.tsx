import { Card } from "@/components/Card";
import type { Dict } from "@/lib/i18n";
import type { ApiErrorKind } from "@/lib/types";

export function ErrorState({
  dict,
  kind,
  onRetry,
}: {
  dict: Dict;
  kind: ApiErrorKind;
  onRetry?: () => void;
}) {
  return (
    <Card className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-aqi-unhealthy-soft text-2xl">
        <span aria-hidden>!</span>
      </div>
      <h2 className="mb-1 text-lg font-semibold text-foreground">{dict.errors.title}</h2>
      <p className="mx-auto mb-4 max-w-sm text-muted">{dict.errors[kind]}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-fg transition hover:opacity-90"
        >
          {dict.errors.retry}
        </button>
      )}
    </Card>
  );
}
