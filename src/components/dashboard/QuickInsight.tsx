import { capitalizeMealType } from "@/lib/dashboard/format";
import type { MealLog } from "@/types/food";

interface QuickInsightProps {
  highestCo2MealType: MealLog["mealType"] | null;
  weeklyAverageKg: number;
  todayKg: number;
}

export function QuickInsight({
  highestCo2MealType,
  weeklyAverageKg,
  todayKg,
}: QuickInsightProps) {
  const insights: string[] = [];

  if (highestCo2MealType) {
    insights.push(
      `${capitalizeMealType(highestCo2MealType)} contributed most CO₂ today.`,
    );
  }

  if (weeklyAverageKg > 0 && todayKg < weeklyAverageKg * 0.9) {
    const pct = Math.round(
      ((weeklyAverageKg - todayKg) / weeklyAverageKg) * 100,
    );
    insights.push(
      `You're about ${pct}% below your 7-day CO₂ average so far — nice steady progress.`,
    );
  } else if (weeklyAverageKg > 0 && todayKg > weeklyAverageKg * 1.1) {
    insights.push(
      "Today is a bit higher than your recent average. That's normal — tomorrow is a fresh start.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Log a few meals to see gentle, actionable insights here.",
    );
  }

  return (
    <section aria-labelledby="quick-insight-heading">
      <h2
        id="quick-insight-heading"
        className="mb-3 text-base font-semibold text-[var(--rcn-text)]"
      >
        Quick insights
      </h2>
      <ul className="flex flex-col gap-3">
        {insights.map((text) => (
          <li
            key={text}
            className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-green-soft)]/50 px-4 py-3 text-sm leading-relaxed text-[var(--rcn-text)]"
          >
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
