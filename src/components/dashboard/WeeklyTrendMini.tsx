import { formatShortDate } from "@/lib/dashboard/format";
import type { DayTrendPoint } from "@/lib/dashboard/summarize";

interface WeeklyTrendMiniProps {
  points: DayTrendPoint[];
}

export function WeeklyTrendMini({ points }: WeeklyTrendMiniProps) {
  const maxKg = Math.max(...points.map((p) => p.totalKg), 0.1);

  return (
    <section
      aria-labelledby="weekly-trend-heading"
      className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-sm"
    >
      <h2
        id="weekly-trend-heading"
        className="text-base font-semibold text-[var(--rcn-text)]"
      >
        7-day overview
      </h2>
      <p className="mt-0.5 text-sm text-[var(--rcn-muted)]">
        CO₂ trend — keep it simple, focus on patterns
      </p>

      <div
        className="mt-5 flex items-end justify-between gap-2"
        role="img"
        aria-label="Seven day CO₂ bar chart"
      >
        {points.map((point) => {
          const height = Math.max(8, Math.round((point.totalKg / maxKg) * 96));
          const isToday = point.date === points[points.length - 1]?.date;

          return (
            <div
              key={point.date}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-24 w-full items-end justify-center">
                <div
                  className={`w-full max-w-8 rounded-t-lg transition-all ${
                    isToday
                      ? "bg-[var(--rcn-green)]"
                      : "bg-[var(--rcn-green)]/35"
                  }`}
                  style={{ height: `${height}px` }}
                  title={`${point.date}: ${point.totalKg.toFixed(2)} kg CO₂`}
                />
              </div>
              <span className="text-[10px] font-medium text-[var(--rcn-muted)]">
                {formatShortDate(point.date)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
