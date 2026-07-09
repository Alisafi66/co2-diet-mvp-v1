import type { Food, FoodCategory } from "@/types/food";
import { FOODS_BY_ID } from "@/lib/seed/foods";

/** Display model for the log-meal search UI (mock / offline). */
export interface FoodSearchItem {
  id: string;
  name: string;
  category: FoodCategory;
  co2Label: string;
  defaultUnit: "ml" | "g";
  defaultQuantity: number;
  icon: string;
  co2PerKg?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
}

export const MOCK_SEARCH_FOODS: FoodSearchItem[] = [
  {
    id: "oat-milk",
    name: "Oat Milk",
    category: "beverages",
    co2Label: "0.6 kg CO₂ / 100 ml",
    defaultUnit: "ml",
    defaultQuantity: 250,
    icon: "🥛",
  },
  {
    id: "whole-milk",
    name: "Whole Milk",
    category: "dairy",
    co2Label: "0.5 kg CO₂ / 100 ml",
    defaultUnit: "ml",
    defaultQuantity: 250,
    icon: "🥛",
  },
  {
    id: "semi-skimmed-milk",
    name: "Semi-skimmed Milk",
    category: "dairy",
    co2Label: "0.5 kg CO₂ / 100 ml",
    defaultUnit: "ml",
    defaultQuantity: 250,
    icon: "🥛",
    co2PerKg: 5,
    caloriesPer100g: 47,
    proteinPer100g: 3.4,
  },
  {
    id: "apple",
    name: "Apple",
    category: "produce",
    co2Label: "0.04 kg CO₂ / 100 g",
    defaultUnit: "g",
    defaultQuantity: 180,
    icon: "🍎",
  },
  {
    id: "rice-cooked",
    name: "Rice (cooked)",
    category: "grains",
    co2Label: "0.12 kg CO₂ / 100 g",
    defaultUnit: "g",
    defaultQuantity: 150,
    icon: "🍚",
    co2PerKg: 1.2,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "meat",
    co2Label: "0.69 kg CO₂ / 100 g",
    defaultUnit: "g",
    defaultQuantity: 150,
    icon: "🍗",
  },
  {
    id: "lentils-cooked",
    name: "Lentils (cooked)",
    category: "legumes",
    co2Label: "0.09 kg CO₂ / 100 g",
    defaultUnit: "g",
    defaultQuantity: 180,
    icon: "🫘",
  },
  {
    id: "soy-milk",
    name: "Soy Milk",
    category: "beverages",
    co2Label: "0.4 kg CO₂ / 100 ml",
    defaultUnit: "ml",
    defaultQuantity: 250,
    icon: "🥛",
    co2PerKg: 4,
    caloriesPer100g: 43,
    proteinPer100g: 3.3,
  },
];

export const MOCK_RECENT_FOODS: FoodSearchItem[] = [
  MOCK_SEARCH_FOODS[0],
  MOCK_SEARCH_FOODS[3],
  MOCK_SEARCH_FOODS[4],
];

export type QuantityUnit = "ml" | "g" | "cups" | "portions";

export const UNIT_OPTIONS: QuantityUnit[] = ["ml", "g", "cups", "portions"];

export const QUICK_ML_PRESETS = [100, 150, 250, 300] as const;
export const QUICK_G_PRESETS = [50, 100, 150, 200] as const;

export function filterFoods(
  foods: FoodSearchItem[],
  query: string,
): FoodSearchItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return foods;
  return foods.filter(
    (food) =>
      food.name.toLowerCase().includes(normalized) ||
      food.category.toLowerCase().includes(normalized),
  );
}

/** Map a search item to a typed Food, preferring the seed database when available. */
export function toFood(item: FoodSearchItem): Food {
  const seed = FOODS_BY_ID[item.id];
  if (seed) {
    return { ...seed, name: item.name };
  }

  const co2PerKg =
    item.co2PerKg ?? parseCo2PerKgFromLabel(item.co2Label) ?? 2;

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    defaultServingG: item.defaultQuantity,
    co2PerKg,
    caloriesPer100g: item.caloriesPer100g ?? 100,
    proteinPer100g: item.proteinPer100g ?? 5,
    source: "Mock search data",
  };
}

function parseCo2PerKgFromLabel(label: string): number | null {
  const match = label.match(/([\d.]+)\s*kg/i);
  if (!match) return null;
  return Number(match[1]) * 10;
}
