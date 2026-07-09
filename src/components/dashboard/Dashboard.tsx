"use client";

import { useMemo } from "react";
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
import { DailySummaryCard } from "./DailySummaryCard";
import { QuickLogActions } from "./QuickLogActions";
import { TodaysMealsList } from "./TodaysMealsList";
import { WeeklyTrendMini } from "./WeeklyTrendMini";
import { QuickInsight } from "./QuickInsight";

/** Phase 1 placeholder targets until FR-012 daily target calculation ships. */
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
  const { logs, customFoods, addMeal, addCustomMeal, hydrated } = useMealLogs();
  const { profile } = useUserProfile();

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

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--rcn-muted)]">
        Loading your day…
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6 pb-24">
      <header>
        <p className="text-sm font-medium text-[var(--rcn-green-dark)]">
          CO₂ Diet
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--rcn-text)]">
          Your daily impact
        </h1>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Track nutrition and CO₂ together — private, offline, no judgement.
        </p>
      </header>

      <DailySummaryCard
        co2={co2}
        nutrition={nutrition}
        targets={targets}
        profile={profile}
        storageMode={storageMode}
      />

      <QuickLogActions addMeal={addMeal} addCustomMeal={addCustomMeal} />

      <TodaysMealsList entries={entries} />

      <QuickInsight
        highestCo2MealType={highestCo2MealType}
        weeklyAverageKg={weeklyAverageKg}
        todayKg={co2.totalKg}
      />

      <WeeklyTrendMini points={weekPoints} />
    </div>
  );
}
