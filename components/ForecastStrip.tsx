import { Card, SectionTitle } from "@/components/Card";
import { AQI_HEX, categoryMeta } from "@/lib/aqi";
import { weekdayIndex } from "@/lib/format";
import type { Dict } from "@/lib/i18n";
import type { ForecastDay } from "@/lib/types";

export function ForecastStrip({
  dict,
  days,
}: {
  dict: Dict;
  days: ForecastDay[] | null;
}) {
  return (
    <Card>
      <SectionTitle>{dict.forecast.title}</SectionTitle>
      {!days || days.length === 0 ? (
        <p className="text-sm text-muted">{dict.forecast.noData}</p>
      ) : (
        <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1">
          {days.map((day, i) => {
            const label =
              i === 0 ? dict.forecast.today : dict.forecast.weekdays[weekdayIndex(day.date)];
            const meta = categoryMeta(day.categoryKey);
            return (
              <div
                key={day.date}
                className={`flex min-w-[5.5rem] flex-1 flex-col items-center rounded-xl ${meta.soft} p-3 text-center`}
              >
                <span className="text-xs font-semibold text-muted">{label}</span>
                <span
                  className="mt-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: AQI_HEX[day.categoryKey] }}
                >
                  {day.aqiMax ?? "—"}
                </span>
                <span className="mt-2 text-xs text-muted">
                  {dict.forecast.high} {day.aqiMax ?? "—"}
                </span>
                <span className="text-xs text-muted">
                  {dict.forecast.low} {day.aqiMin ?? "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
