"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, SectionTitle } from "@/components/Card";
import { formatTime } from "@/lib/format";
import type { Dict, Language } from "@/lib/i18n";
import type { TrendPoint } from "@/lib/types";

export function TrendChart({
  dict,
  points,
  lang,
}: {
  dict: Dict;
  points: TrendPoint[] | null;
  lang: Language;
}) {
  const data = (points ?? [])
    .filter((p) => p.aqi != null)
    .map((p) => ({ time: formatTime(p.time, lang), aqi: p.aqi as number }));

  return (
    <Card>
      <SectionTitle>{dict.trend.title}</SectionTitle>
      {data.length === 0 ? (
        <p className="text-sm text-muted">{dict.trend.noData}</p>
      ) : (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted)" }}
                width={40}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--muted)" }}
                formatter={(value) => [value, dict.trend.aqi]}
              />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
