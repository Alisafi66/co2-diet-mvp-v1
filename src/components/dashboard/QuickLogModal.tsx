"use client";

import { useEffect, useId, useState } from "react";
import type { MealLog } from "@/types/food";
import { SEED_FOODS } from "@/lib/seed/foods";

interface QuickLogModalProps {
  mealType: MealLog["mealType"] | null;
  onClose: () => void;
  onSubmit: (meal: MealLog) => void;
}

export function QuickLogModal({ mealType, onClose, onSubmit }: QuickLogModalProps) {
  const titleId = useId();
  const [foodId, setFoodId] = useState(SEED_FOODS[0]?.id ?? "custom");
  const [foodName, setFoodName] = useState(SEED_FOODS[0]?.name ?? "");
  const [quantityG, setQuantityG] = useState(
    String(SEED_FOODS[0]?.defaultServingG ?? 100),
  );

  useEffect(() => {
    const selected = SEED_FOODS.find((food) => food.id === foodId);
    if (selected) {
      setFoodName(selected.name);
      setQuantityG(String(selected.defaultServingG));
    }
  }, [foodId]);

  if (!mealType) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedQuantity = Number(quantityG);
    if (!foodName.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      foodId,
      foodName: foodName.trim(),
      quantityG: parsedQuantity,
      loggedAt: new Date().toISOString(),
      mealType,
    });
    onClose();
  };

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
        className="w-full max-w-md rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Log {mealType}
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Temporary quick entry — values update the dashboard immediately.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Food</span>
            <select
              value={foodId}
              onChange={(event) => setFoodId(event.target.value)}
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
            >
              {SEED_FOODS.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
              <option value="custom">Custom food</option>
            </select>
          </label>

          {foodId === "custom" ? (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">Food name</span>
              <input
                type="text"
                value={foodName}
                onChange={(event) => setFoodName(event.target.value)}
                placeholder="e.g. Greek yogurt"
                className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
                required
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Quantity (g)</span>
            <input
              type="number"
              min={1}
              step={1}
              value={quantityG}
              onChange={(event) => setQuantityG(event.target.value)}
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
              required
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 flex-1 rounded-xl border border-[var(--rcn-border)] text-sm font-medium text-[var(--rcn-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-xl bg-[var(--rcn-green)] text-sm font-medium text-white"
            >
              Add meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
