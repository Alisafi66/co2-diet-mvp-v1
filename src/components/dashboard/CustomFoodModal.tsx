"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { Food, FoodCategory, MealLog } from "@/types/food";
import {
  CATEGORY_DEFAULTS,
  buildFoodFromCategory,
} from "@/lib/co2/categoryDefaults";
import { estimateCo2 } from "@/lib/co2/estimate";
import { calculateNutrition } from "@/lib/nutrition/calculate";
import {
  formatCalories,
  formatCo2Kg,
  formatProtein,
} from "@/lib/dashboard/format";

const FOOD_CATEGORIES: FoodCategory[] = [
  "produce",
  "dairy",
  "meat",
  "seafood",
  "grains",
  "legumes",
  "beverages",
  "processed",
  "other",
];

const MEAL_TYPES: MealLog["mealType"][] = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
];

const inputClassName =
  "min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]";

interface CustomFoodModalProps {
  open: boolean;
  defaultMealType?: MealLog["mealType"];
  onClose: () => void;
  onSubmit: (meal: MealLog, food: Food) => void;
}

export function CustomFoodModal({
  open,
  defaultMealType = "snack",
  onClose,
  onSubmit,
}: CustomFoodModalProps) {
  const titleId = useId();
  const [foodName, setFoodName] = useState("");
  const [quantityG, setQuantityG] = useState("100");
  const [category, setCategory] = useState<FoodCategory>("other");
  const [mealType, setMealType] = useState<MealLog["mealType"]>(defaultMealType);
  const [co2PerKg, setCo2PerKg] = useState(String(CATEGORY_DEFAULTS.other.co2PerKg));
  const [caloriesPer100g, setCaloriesPer100g] = useState(
    String(CATEGORY_DEFAULTS.other.caloriesPer100g),
  );
  const [proteinPer100g, setProteinPer100g] = useState(
    String(CATEGORY_DEFAULTS.other.proteinPer100g),
  );

  useEffect(() => {
    if (open) {
      setMealType(defaultMealType);
    }
  }, [open, defaultMealType]);

  const previewFood = useMemo((): Food | null => {
    const weight = Number(quantityG);
    const co2 = Number(co2PerKg);
    const kcal = Number(caloriesPer100g);
    const protein = Number(proteinPer100g);

    if (
      !foodName.trim() ||
      !Number.isFinite(weight) ||
      weight <= 0 ||
      !Number.isFinite(co2) ||
      !Number.isFinite(kcal) ||
      !Number.isFinite(protein)
    ) {
      return null;
    }

    return {
      id: "preview",
      name: foodName.trim(),
      category,
      defaultServingG: weight,
      co2PerKg: co2,
      caloriesPer100g: kcal,
      proteinPer100g: protein,
      source: "Custom entry",
    };
  }, [foodName, quantityG, category, co2PerKg, caloriesPer100g, proteinPer100g]);

  const preview = useMemo(() => {
    if (!previewFood) return null;
    const weight = Number(quantityG);
    const co2 = estimateCo2(previewFood, weight);
    const nutrition = calculateNutrition(previewFood, weight);
    return { co2, nutrition };
  }, [previewFood, quantityG]);

  const applyCategoryEstimate = () => {
    const defaults = CATEGORY_DEFAULTS[category];
    setCo2PerKg(String(defaults.co2PerKg));
    setCaloriesPer100g(String(defaults.caloriesPer100g));
    setProteinPer100g(String(defaults.proteinPer100g));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const weight = Number(quantityG);
    if (!foodName.trim() || !Number.isFinite(weight) || weight <= 0) {
      return;
    }

    const food = buildFoodFromCategory(foodName.trim(), category, weight);
    food.co2PerKg = Number(co2PerKg);
    food.caloriesPer100g = Number(caloriesPer100g);
    food.proteinPer100g = Number(proteinPer100g);
    food.source = "Custom entry — user defined";

    const meal: MealLog = {
      id: crypto.randomUUID(),
      foodId: food.id,
      foodName: food.name,
      quantityG: weight,
      loggedAt: new Date().toISOString(),
      mealType,
    };

    onSubmit(meal, food);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFoodName("");
    setQuantityG("100");
    setCategory("other");
    setCo2PerKg(String(CATEGORY_DEFAULTS.other.co2PerKg));
    setCaloriesPer100g(String(CATEGORY_DEFAULTS.other.caloriesPer100g));
    setProteinPer100g(String(CATEGORY_DEFAULTS.other.proteinPer100g));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Add custom food
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Enter your own item — estimate from category or set values manually.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Food name</span>
            <input
              type="text"
              value={foodName}
              onChange={(event) => setFoodName(event.target.value)}
              placeholder="e.g. Homemade granola"
              className={inputClassName}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Weight (g)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={quantityG}
              onChange={(event) => setQuantityG(event.target.value)}
              className={inputClassName}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Meal</span>
            <select
              value={mealType}
              onChange={(event) =>
                setMealType(event.target.value as MealLog["mealType"])
              }
              className={inputClassName}
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-green-soft)]/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="flex flex-1 flex-col gap-1.5 text-sm">
                <span className="font-medium text-[var(--rcn-text)]">Category</span>
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as FoodCategory)
                  }
                  className={inputClassName}
                >
                  {FOOD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={applyCategoryEstimate}
                className="mt-6 min-h-12 shrink-0 rounded-xl bg-[var(--rcn-green)] px-4 text-sm font-medium text-white"
              >
                Estimate
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--rcn-muted)]">
              Uses category averages for CO₂ and nutrition per 100 g — you can
              adjust below.
            </p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-[var(--rcn-text)]">
              Values per 100 g
            </legend>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-[var(--rcn-muted)]">CO₂ (kg per kg food)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={co2PerKg}
                onChange={(event) => setCo2PerKg(event.target.value)}
                className={inputClassName}
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-[var(--rcn-muted)]">Calories (kcal)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={caloriesPer100g}
                onChange={(event) => setCaloriesPer100g(event.target.value)}
                className={inputClassName}
                required
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-[var(--rcn-muted)]">Protein (g)</span>
              <input
                type="number"
                min={0}
                step={0.1}
                value={proteinPer100g}
                onChange={(event) => setProteinPer100g(event.target.value)}
                className={inputClassName}
                required
              />
            </label>
          </fieldset>

          {preview ? (
            <div
              className="rounded-xl bg-[var(--rcn-green-soft)]/60 px-4 py-3 text-sm text-[var(--rcn-text)]"
              aria-live="polite"
            >
              <p className="font-medium">Portion preview ({quantityG} g)</p>
              <p className="mt-1 text-[var(--rcn-muted)]">
                {formatCo2Kg(preview.co2.totalKg)} CO₂ ·{" "}
                {formatCalories(preview.nutrition.calories)} ·{" "}
                {formatProtein(preview.nutrition.proteinG)} protein
              </p>
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="min-h-12 flex-1 rounded-xl border border-[var(--rcn-border)] text-sm font-medium text-[var(--rcn-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-xl bg-[var(--rcn-green)] text-sm font-medium text-white"
            >
              Add to today
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
