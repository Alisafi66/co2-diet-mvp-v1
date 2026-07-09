"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { MealLog } from "@/types/food";
import { useMealLogs } from "@/hooks/useMealLogs";
import { buildMealLog, toQuantityGrams } from "@/lib/logging/buildMealLog";
import {
  MOCK_RECENT_FOODS,
  MOCK_SEARCH_FOODS,
  QUICK_G_PRESETS,
  QUICK_ML_PRESETS,
  UNIT_OPTIONS,
  filterFoods,
  toFood,
  type FoodSearchItem,
  type QuantityUnit,
} from "@/lib/logging/mockFoods";
import { FOODS_BY_ID } from "@/lib/seed/foods";
const MEAL_TYPES: { id: MealLog["mealType"]; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

function BackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 text-[var(--rcn-muted)]"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

interface LogMealScreenProps {
  defaultMealType?: MealLog["mealType"];
}

export function LogMealScreen({
  defaultMealType = "breakfast",
}: LogMealScreenProps) {
  const router = useRouter();
  const { addMeal, addCustomMeal } = useMealLogs();
  const [mealType, setMealType] = useState<MealLog["mealType"]>(defaultMealType);  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(250);
  const [unit, setUnit] = useState<QuantityUnit>("ml");

  const matches = useMemo(
    () => filterFoods(MOCK_SEARCH_FOODS, searchQuery),
    [searchQuery],
  );

  const selectedFood = useMemo(
    () => matches.find((food) => food.id === selectedId) ?? null,
    [matches, selectedId],
  );

  const selectFood = (food: FoodSearchItem) => {
    setSelectedId(food.id);
    setQuantity(food.defaultQuantity);
    setUnit(food.defaultUnit);
  };

  const adjustQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToMeal = () => {
    if (!selectedFood) return;

    const food = toFood(selectedFood);
    const quantityG = toQuantityGrams(quantity, unit, food);
    const meal = buildMealLog({ food, quantityG, mealType });

    if (FOODS_BY_ID[food.id]) {
      addMeal(meal);
    } else {
      addCustomMeal(meal, food);
    }

    router.push("/dashboard");
  };
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-[var(--rcn-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--rcn-border)] bg-[var(--rcn-surface)] px-4 py-3">
        <div className="grid grid-cols-[44px_1fr_44px] items-center">
          <Link
            href="/dashboard"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--rcn-text)] hover:bg-[var(--rcn-green-soft)]/50"
            aria-label="Go back"
          >
            <BackIcon />
          </Link>
          <h1 className="text-center text-lg font-bold text-[var(--rcn-green-dark)]">
            Log Meal
          </h1>
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--rcn-muted)] hover:bg-[var(--rcn-green-soft)]/50"
            aria-label="Meal history"
          >
            <HistoryIcon />
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-5 px-4 py-5 pb-8">
        {/* Meal selector */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Meal type"
        >
          {MEAL_TYPES.map(({ id, label }) => {
            const active = mealType === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMealType(id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--rcn-green-dark)] text-white"
                    : "bg-[var(--rcn-border)]/60 text-[var(--rcn-muted)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <label className="relative block">
          <span className="sr-only">Search food</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search food (e.g. milk, rice, apple)"
            className="min-h-12 w-full rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] py-3 pl-12 pr-4 text-[var(--rcn-text)] placeholder:text-[var(--rcn-muted)] shadow-sm outline-none focus:border-[var(--rcn-green)] focus:ring-2 focus:ring-[var(--rcn-green)]/20"
          />
        </label>

        {/* Matches */}
        <section aria-labelledby="matches-heading">
          <h2
            id="matches-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--rcn-muted)]"
          >
            Matches
          </h2>
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--rcn-border)] bg-[var(--rcn-surface)] px-4 py-8 text-center text-sm text-[var(--rcn-muted)]">
              No foods match your search.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {matches.map((food) => (
                <li key={food.id}>
                  <FoodRow
                    food={food}
                    selected={selectedId === food.id}
                    onSelect={() => selectFood(food)}
                  />
                  {selectedId === food.id ? (
                    <QuantityAdjuster
                      quantity={quantity}
                      unit={unit}
                      onQuantityChange={setQuantity}
                      onUnitChange={setUnit}
                      onAdjust={adjustQuantity}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Add to meal */}
        {selectedFood ? (
          <button
            type="button"
            onClick={handleAddToMeal}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--rcn-green-dark)] text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--rcn-green)] active:scale-[0.99]"
          >
            <CheckIcon />
            Add to Meal
          </button>
        ) : null}

        {/* Recent */}
        <section aria-labelledby="recent-heading" className="mt-2">
          <h2
            id="recent-heading"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--rcn-muted)]"
          >
            Recent
          </h2>
          <ul className="flex flex-col gap-2">
            {MOCK_RECENT_FOODS.map((food) => (
              <li key={`recent-${food.id}`}>
                <FoodRow
                  food={food}
                  selected={selectedId === food.id}
                  onSelect={() => selectFood(food)}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function FoodRow({
  food,
  selected,
  onSelect,
}: {
  food: FoodSearchItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border bg-[var(--rcn-surface)] p-3 shadow-sm transition-colors ${
        selected
          ? "border-[var(--rcn-green)] ring-1 ring-[var(--rcn-green)]/30"
          : "border-[var(--rcn-border)]"
      }`}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--rcn-green-soft)]/70 text-xl"
        aria-hidden
      >
        {food.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[var(--rcn-text)]">
          {food.name}
        </p>
        <p className="mt-0.5 truncate text-sm text-[var(--rcn-muted)]">
          {food.co2Label}
        </p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${food.name}`}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--rcn-border)] bg-[var(--rcn-bg)] text-xl font-medium text-[var(--rcn-green-dark)] transition-colors hover:border-[var(--rcn-green)] hover:bg-[var(--rcn-green-soft)]"
      >
        +
      </button>
    </div>
  );
}

function QuantityAdjuster({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  onAdjust,
}: {
  quantity: number;
  unit: QuantityUnit;
  onQuantityChange: (value: number) => void;
  onUnitChange: (unit: QuantityUnit) => void;
  onAdjust: (delta: number) => void;
}) {
  const presets = unit === "ml" ? QUICK_ML_PRESETS : QUICK_G_PRESETS;

  return (
    <div className="mt-2 rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-green-soft)]/25 p-4">
      {/* Stepper row */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onAdjust(unit === "ml" ? -10 : -5)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] text-lg font-medium text-[var(--rcn-text)]"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next) && next > 0) onQuantityChange(next);
          }}
          className="min-h-11 w-28 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] text-center text-base font-medium text-[var(--rcn-text)]"
          aria-label="Quantity"
        />
        <span className="text-sm font-medium text-[var(--rcn-muted)]">
          {unit}
        </span>
        <button
          type="button"
          onClick={() => onAdjust(unit === "ml" ? 10 : 5)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] text-lg font-medium text-[var(--rcn-text)]"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Unit toggles */}
      <div className="mt-4 flex flex-wrap gap-2">
        {UNIT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onUnitChange(option)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              unit === option
                ? "bg-[var(--rcn-green-dark)] text-white"
                : "bg-[var(--rcn-surface)] text-[var(--rcn-muted)] border border-[var(--rcn-border)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Quick-add presets */}
      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onQuantityChange(preset)}
            className="rounded-full border border-[var(--rcn-border)] bg-[var(--rcn-surface)] px-3 py-1.5 text-sm font-medium text-[var(--rcn-text)] hover:border-[var(--rcn-green)]"
          >
            {preset}
            {unit}
          </button>
        ))}
      </div>
    </div>
  );
}
