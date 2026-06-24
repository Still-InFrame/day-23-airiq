import clsx from "clsx";
import type { ReactNode } from "react";

/** Shared card surface used by every dashboard section. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small uppercase section label. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
      {children}
    </h2>
  );
}
