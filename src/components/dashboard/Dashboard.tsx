"use client";

import { useMemo, useState } from "react";
import type { Food } from "@/types/food";
import { FOODS_BY_ID } from "@/lib/seed/foods";
import {
  findHighestCo2MealType,
  getDateKey,
  summarizeDay,
  summarizeWeek,
} from "@/lib/dashboard/summarize";
import { useMealLogs } from "@/hooks/useMealLogs";
import { useUserProfile } from "@/hooks/UserProvider";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { DailySummaryCard } from "./DailySummaryCard";
import { QuickLogActions } from "./QuickLogActions";
import { TodaysMealsList } from "./TodaysMealsList";
import { WeeklyTrendMini } from "./WeeklyTrendMini";
import { QuickInsight } from "./QuickInsight";
import { WeightLogModal } from "./WeightLogModal";
import { WeightTrendMini } from "./WeightTrendMini";
import { UserSettingsModal } from "./UserSettingsModal";
import { RemindersCard } from "./RemindersCard";

/** Fallback targets used only when no user profile exists yet. */
const DEFAULT_TARGETS = {
  co2Kg: 3.8,
  calories: 2100,
  proteinG: 95,
} as const;

export interface DashboardProps {
  foodsById?: Record<string, Food>;
  storageMode?: "local" | "synced";
}

export function Dashboard({
  foodsById: seedFoodsById = FOODS_BY_ID,
  storageMode = "local",
}: DashboardProps) {
  const { logs, customFoods, addMeal, addCustomMeal, hydrated: mealsHydrated } = useMealLogs();
  const { profile, updateProfile } = useUserProfile();

  const { weightLogs, addWeightLog } = useWeightLogs();
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const foodsById = useMemo(
    () => ({ ...seedFoodsById, ...customFoods }),
    [seedFoodsById, customFoods],
  );

  const todayKey = getDateKey();

  const { co2, nutrition, entries } = useMemo(
    () => summarizeDay(logs, foodsById, todayKey),
    [logs, foodsById, todayKey],
  );

  const weekPoints = useMemo(
    () => summarizeWeek(logs, foodsById),
    [logs, foodsById],
  );

  const targets = useMemo(
    () => ({
      co2Kg: profile?.dailyCo2BudgetKg ?? DEFAULT_TARGETS.co2Kg,
      calories: profile?.dailyCalorieTarget ?? DEFAULT_TARGETS.calories,
      proteinG: profile?.dailyProteinTargetG ?? DEFAULT_TARGETS.proteinG,
    }),
    [
      profile?.dailyCo2BudgetKg,
      profile?.dailyCalorieTarget,
      profile?.dailyProteinTargetG,
    ],
  );

  const highestCo2MealType = useMemo(
    () => findHighestCo2MealType(entries),
    [entries],
  );

  const weeklyAverageKg = useMemo(() => {
    const total = weekPoints.reduce((sum, point) => sum + point.totalKg, 0);
    return total / weekPoints.length;
  }, [weekPoints]);

  const latestWeight = useMemo(() => {
    if (weightLogs.length === 0) return null;
    return weightLogs[weightLogs.length - 1].weightKg;
  }, [weightLogs]);

  if (!mealsHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--rcn-muted)]">
        Loading your day…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6 pb-24">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--rcn-green-dark)]">
            CO₂ Diet
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--rcn-text)]">
            Your daily impact
          </h1>
          <p className="mt-1 text-sm text-[var(--rcn-muted)]">
            Track nutrition and CO₂ together — private, offline, no judgement.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          aria-label="Open settings"
          className="mt-1 rounded-xl border border-[var(--rcn-border)] p-2 text-[var(--rcn-muted)] transition-colors hover:bg-[var(--rcn-green-soft)] hover:text-[var(--rcn-green-dark)]"
        >
          ⚙️
        </button>
      </header>

      <DailySummaryCard
        co2={co2}
        nutrition={nutrition}
        targets={targets}
        profile={profile}
        storageMode={storageMode}
      />
      <QuickLogActions
        addMeal={addMeal}
        addCustomMeal={addCustomMeal}
        logs={logs}
        foodsById={foodsById}
      />
      <section aria-labelledby="weight-tracking-heading" className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="weight-tracking-heading" className="text-base font-semibold text-[var(--rcn-text)]">
              Weight Tracking
            </h2>
            <p className="mt-1 text-sm text-[var(--rcn-muted)]">
              {latestWeight ? `Current: ${latestWeight} kg` : "No weight logged yet"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWeightModalOpen(true)}
            className="rounded-xl bg-[var(--rcn-green-soft)] px-4 py-2 text-sm font-medium text-[var(--rcn-green-dark)] transition-colors hover:bg-[var(--rcn-green)] hover:text-white"
          >
            Log Weight
          </button>
        </div>

        {/* Render the mini chart only if there are enough logs */}
        <WeightTrendMini logs={weightLogs} />
      </section>
      <RemindersCard />
      <TodaysMealsList entries={entries} />

      <QuickInsight
        highestCo2MealType={highestCo2MealType}
        weeklyAverageKg={weeklyAverageKg}
        todayKg={co2.totalKg}
      />

      <WeeklyTrendMini points={weekPoints} />

      <WeightLogModal
        open={weightModalOpen}
        onClose={() => setWeightModalOpen(false)}
        onAdd={addWeightLog}
      />

      <UserSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </div>
  );
}