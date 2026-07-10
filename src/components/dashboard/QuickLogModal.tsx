"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { MealLog, Food } from "@/types/food";
import { SEED_FOODS } from "@/lib/seed/foods";
import { searchOpenFoodFacts } from "@/lib/food/openFoodFacts";
import { getRecentFoods } from "@/lib/logging/recentFoods";
import { useFavorites } from "@/hooks/useFavorites";
import { BarcodeScannerModal } from "./BarcodeScannerModal";

interface QuickLogModalProps {
  mealType: MealLog["mealType"] | null;
  onClose: () => void;
  onSubmit: (meal: MealLog, food?: Food) => void;
  logs: MealLog[];
  foodsById: Record<string, Food>;
}

export function QuickLogModal({
  mealType,
  onClose,
  onSubmit,
  logs,
  foodsById,
}: QuickLogModalProps) {
  const titleId = useId();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [foodId, setFoodId] = useState(SEED_FOODS[0]?.id ?? "custom");
  const [foodName, setFoodName] = useState(SEED_FOODS[0]?.name ?? "");
  const [quantityG, setQuantityG] = useState(String(SEED_FOODS[0]?.defaultServingG ?? 100));

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedApiFood, setSelectedApiFood] = useState<Food | null>(null);

  const { favoritesList, isFavorite, toggleFavorite } = useFavorites();

  const recentPicks = useMemo(
    () => getRecentFoods(logs, foodsById, 5),
    [logs, foodsById],
  );

  useEffect(() => {
    if (foodId !== "api_search" && foodId !== "custom") {
      const selected = SEED_FOODS.find((food) => food.id === foodId);
      if (selected) {
        setFoodName(selected.name);
        setQuantityG(String(selected.defaultServingG));
        setSelectedApiFood(null);
      }
    }
  }, [foodId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setFoodId("api_search");

    const results = await searchOpenFoodFacts(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  /** Pre-fills the form from a recent-food pick without submitting. */
  const applyRecentPick = (pick: { foodId: string; foodName: string; quantityG: number; food?: Food }) => {
    if (pick.food) {
      setSelectedApiFood(pick.food);
      setFoodId("api_search");
      setSearchResults([]);
    } else {
      setSelectedApiFood(null);
      setFoodId(pick.foodId);
    }
    setFoodName(pick.foodName);
    setQuantityG(String(pick.quantityG));
  };

  /** Pre-fills the form from a favorited food without submitting. */
  const applyFavorite = (food: Food) => {
    setSelectedApiFood(food);
    setFoodId("api_search");
    setSearchResults([]);
    setFoodName(food.name);
    setQuantityG(String(food.defaultServingG));
  };

  /** Pre-fills the form from a scanned barcode result without submitting. */
  const handleBarcodeFound = (food: Food) => {
    setSelectedApiFood(food);
    setFoodId("api_search");
    setSearchResults([]);
    setFoodName(food.name);
    setQuantityG(String(food.defaultServingG));
  };

  if (!mealType) return null;

  const currentFoodForFavoriting: Food | null = selectedApiFood
    ? selectedApiFood
    : foodsById[foodId] ?? null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const parsedQuantity = Number(quantityG);
    if (!foodName.trim() || !Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return;
    }

    const meal: MealLog = {
      id: crypto.randomUUID(),
      foodId: selectedApiFood ? selectedApiFood.id : foodId,
      foodName: foodName.trim(),
      quantityG: parsedQuantity,
      loggedAt: new Date().toISOString(),
      mealType,
    };

    onSubmit(meal, selectedApiFood || undefined);
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
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Log {mealType}
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Search 4.5M products or use your local offline list.
        </p>

        {(recentPicks.length > 0 || favoritesList.length > 0) && (
          <div className="mt-3 flex flex-col gap-2">
            {recentPicks.length > 0 && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--rcn-muted)]">
                  Recent
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {recentPicks.map((pick) => (
                    <button
                      key={pick.foodId}
                      type="button"
                      onClick={() => applyRecentPick(pick)}
                      className="rounded-full border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 py-1.5 text-xs font-medium text-[var(--rcn-text)] hover:border-[var(--rcn-green)]"
                    >
                      {pick.foodName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {favoritesList.length > 0 && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--rcn-muted)]">
                  Favorites
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {favoritesList.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => applyFavorite(food)}
                      className="rounded-full border border-[var(--rcn-green)] bg-[var(--rcn-green-soft)]/40 px-3 py-1.5 text-xs font-medium text-[var(--rcn-green-dark)]"
                    >
                      ★ {food.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Online Database Search</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Open Food Facts..."
                className="min-h-12 flex-1 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="min-h-12 rounded-xl bg-[var(--rcn-green)] px-4 font-medium text-white disabled:opacity-50"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="mt-2 min-h-11 w-full rounded-xl border border-[var(--rcn-border)] text-sm font-medium text-[var(--rcn-green-dark)]"
            >
              📷 Scan barcode
            </button>

            {searchResults.length > 0 && foodId === "api_search" && (
              <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-xl border border-[var(--rcn-border)] p-2">
                {searchResults.map((apiFood) => (
                  <button
                    key={apiFood.id}
                    type="button"
                    onClick={() => {
                      setSelectedApiFood(apiFood);
                      setFoodName(apiFood.name);
                      setQuantityG(String(apiFood.defaultServingG));
                      setSearchResults([]);
                    }}
                    className="text-left px-2 py-1.5 text-sm hover:bg-[var(--rcn-bg)] rounded-lg"
                  >
                    <span className="font-medium">{apiFood.name}</span>
                    <span className="text-[var(--rcn-muted)] ml-2 text-xs">
                      {apiFood.caloriesPer100g} kcal/100g
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-[var(--rcn-border)]"></div>
            <span className="mx-4 shrink-0 text-xs text-[var(--rcn-muted)]">OR OFFLINE LIST</span>
            <div className="flex-grow border-t border-[var(--rcn-border)]"></div>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Local Offline Foods</span>
            <select
              value={foodId}
              onChange={(event) => setFoodId(event.target.value)}
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
            >
              <option value="api_search" disabled className="hidden">Using Online Search...</option>
              {SEED_FOODS.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
              <option value="custom">Custom food</option>
            </select>
          </label>

          {foodId === "custom" || (foodId === "api_search" && selectedApiFood) ? (
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

          {currentFoodForFavoriting && (
            <button
              type="button"
              onClick={() => toggleFavorite(currentFoodForFavoriting)}
              className="self-start text-sm font-medium text-[var(--rcn-green-dark)]"
            >
              {isFavorite(currentFoodForFavoriting.id) ? "★ Remove favorite" : "☆ Add to favorites"}
            </button>
          )}

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

        <BarcodeScannerModal
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onFound={handleBarcodeFound}
        />
      </div>
    </div>
  );
}