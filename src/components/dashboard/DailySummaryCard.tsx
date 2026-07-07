import type { DailyCo2Summary } from "@/types/co2";
import type { UserProfile } from "@/types/user";
import type { DailyNutritionSummary } from "@/lib/dashboard/summarize";
import {
  formatCalories,
  formatCo2Kg,
  formatProtein,
} from "@/lib/dashboard/format";

interface DailyTargets {
  co2Kg: number;
  calories: number;
  proteinG: number;
}

interface DailySummaryCardProps {
  co2: DailyCo2Summary;
  nutrition: DailyNutritionSummary;
  targets: DailyTargets;
  profile?: UserProfile | null;
  storageMode?: "local" | "synced";
}

function progressPercent(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((value / target) * 100));
}

function statusLabel(
  value: number,
  target: number,
): { text: string; tone: "neutral" | "positive" | "caution" } {
  const ratio = value / target;
  if (ratio <= 0.85) return { text: "On track", tone: "positive" };
  if (ratio <= 1.05) return { text: "Close to goal", tone: "neutral" };
  return { text: "Above target today", tone: "caution" };
}

export function DailySummaryCard({
  co2,
  nutrition,
  targets,
  profile,
  storageMode = "local",
}: DailySummaryCardProps) {
  const co2Status = statusLabel(co2.totalKg, targets.co2Kg);
  const calorieStatus = statusLabel(nutrition.calories, targets.calories);
  const proteinStatus = statusLabel(nutrition.proteinG, targets.proteinG);

  const segments = [
    { label: "CO₂", percent: progressPercent(co2.totalKg, targets.co2Kg) },
    {
      label: "Cal",
      percent: progressPercent(nutrition.calories, targets.calories),
    },
    {
      label: "Protein",
      percent: progressPercent(nutrition.proteinG, targets.proteinG),
    },
  ];

  return (
    <section
      aria-labelledby="daily-summary-heading"
      className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-sm"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2
            id="daily-summary-heading"
            className="text-lg font-semibold text-[var(--rcn-text)]"
          >
            Today
          </h2>
          <p className="mt-0.5 text-sm text-[var(--rcn-muted)]">
            {storageMode === "local"
              ? "Stored on this device"
              : "Synced across devices"}
          </p>
        </div>
        {profile?.displayName ? (
          <span className="rounded-full bg-[var(--rcn-green-soft)] px-3 py-1 text-xs font-medium text-[var(--rcn-green-dark)]">
            {profile.displayName}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricBlock
          label="CO₂ impact"
          value={formatCo2Kg(co2.totalKg)}
          sub={`Target: ${formatCo2Kg(targets.co2Kg)}`}
          status={co2Status}
        />
        <MetricBlock
          label="Calories"
          value={formatCalories(nutrition.calories)}
          sub={calorieStatus.text}
          status={calorieStatus}
        />
        <MetricBlock
          label="Protein"
          value={formatProtein(nutrition.proteinG)}
          sub={proteinStatus.text}
          status={proteinStatus}
        />
      </div>

      <div
        className="mt-5 flex h-2 overflow-hidden rounded-full bg-[var(--rcn-green-soft)]"
        role="img"
        aria-label="Combined progress toward CO₂, calorie, and protein goals"
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="h-full bg-[var(--rcn-green)] transition-all"
            style={{ width: `${segment.percent / segments.length}%` }}
            title={`${segment.label}: ${segment.percent}%`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--rcn-muted)]">
        Estimates based on your logged meals — small changes add up over time.
      </p>
    </section>
  );
}

function MetricBlock({
  label,
  value,
  sub,
  status,
}: {
  label: string;
  value: string;
  sub: string;
  status: { text: string; tone: "neutral" | "positive" | "caution" };
}) {
  const toneClass =
    status.tone === "positive"
      ? "text-[var(--rcn-green-dark)]"
      : status.tone === "caution"
        ? "text-amber-700"
        : "text-[var(--rcn-muted)]";

  return (
    <div className="rounded-xl bg-[var(--rcn-green-soft)]/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--rcn-muted)]">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-[var(--rcn-text)]">
        {value}
      </p>
      <p className={`mt-0.5 text-sm ${toneClass}`}>{sub}</p>
    </div>
  );
}
