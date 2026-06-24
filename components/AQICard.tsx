import clsx from "clsx";
import { Card } from "@/components/Card";
import { AQI_HEX, categoryMeta } from "@/lib/aqi";
import { formatDateTime } from "@/lib/format";
import type { Dict, Language } from "@/lib/i18n";
import type { CurrentAirQuality } from "@/lib/types";

export function AQICard({
  dict,
  data,
  lang,
}: {
  dict: Dict;
  data: CurrentAirQuality;
  lang: Language;
}) {
  const meta = categoryMeta(data.categoryKey);
  const categoryText = data.categoryLabel || dict.aqi.categories[data.categoryKey].label;

  return (
    <Card className={clsx("border-none", meta.soft)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {dict.aqi.indexLabel}
      </p>

      <div className="mt-3 flex items-center gap-5">
        <div
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-sm"
          style={{ backgroundColor: AQI_HEX[data.categoryKey] }}
        >
          <span className="text-3xl font-bold leading-none">{data.aqiDisplay}</span>
          <span className="mt-1 text-[10px] uppercase tracking-wide opacity-90">AQI</span>
        </div>

        <div className="min-w-0">
          <p className={clsx("text-xl font-bold leading-tight", meta.color)}>{categoryText}</p>
          {data.dominantPollutantName && (
            <p className="mt-1 text-sm text-muted">
              {dict.aqi.dominant}: <span className="font-medium text-foreground">{data.dominantPollutantName}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            {dict.aqi.updated}: {formatDateTime(data.dateTime, lang)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground">
        {dict.aqi.categories[data.categoryKey].meaning}
      </p>
    </Card>
  );
}
