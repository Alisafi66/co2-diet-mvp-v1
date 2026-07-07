"use client";

import { useState } from "react";
import type { Food, MealLog } from "@/types/food";
import { QuickLogModal } from "./QuickLogModal";
import { CustomFoodModal } from "./CustomFoodModal";

const MEAL_TYPES: MealLog["mealType"][] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

const LABELS: Record<MealLog["mealType"], string> = {
  breakfast: "Log Breakfast",
  lunch: "Log Lunch",
  dinner: "Log Dinner",
  snack: "Log Snack",
};

interface QuickLogActionsProps {
  addMeal: (meal: MealLog) => void;
  addCustomMeal: (meal: MealLog, food: Food) => void;
}

export function QuickLogActions({ addMeal, addCustomMeal }: QuickLogActionsProps) {
  const [pendingMealType, setPendingMealType] = useState<MealLog["mealType"] | null>(
    null,
  );
  const [customFoodOpen, setCustomFoodOpen] = useState(false);

  return (
    <>
      <section aria-labelledby="quick-log-heading">
        <h2
          id="quick-log-heading"
          className="mb-3 text-base font-semibold text-[var(--rcn-text)]"
        >
          Quick log
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEAL_TYPES.map((mealType) => (
            <button
              key={mealType}
              type="button"
              onClick={() => setPendingMealType(mealType)}
              className="min-h-14 rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] px-5 py-4 text-left text-base font-medium text-[var(--rcn-text)] shadow-sm transition-colors hover:border-[var(--rcn-green)] hover:bg-[var(--rcn-green-soft)]/40 active:scale-[0.99]"
            >
              {LABELS[mealType]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCustomFoodOpen(true)}
          className="mt-3 min-h-11 w-full rounded-xl text-sm font-medium text-[var(--rcn-green-dark)] underline-offset-2 hover:underline"
        >
          + Add custom food
        </button>
      </section>

      <QuickLogModal
        mealType={pendingMealType}
        onClose={() => setPendingMealType(null)}
        onSubmit={addMeal}
      />

      <CustomFoodModal
        open={customFoodOpen}
        defaultMealType={pendingMealType ?? "snack"}
        onClose={() => setCustomFoodOpen(false)}
        onSubmit={addCustomMeal}
      />
    </>
  );
}
