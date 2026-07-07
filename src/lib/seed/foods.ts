import type { Food } from "@/types/food";

/** MVP offline seed foods — replaced by Open Food Facts sync in Phase 2. */
export const SEED_FOODS: Food[] = [
  {
    id: "oat-milk",
    name: "Oat milk",
    category: "beverages",
    defaultServingG: 250,
    co2PerKg: 0.9,
    caloriesPer100g: 45,
    proteinPer100g: 1,
    source: "Poore & Nemecek baseline",
  },
  {
    id: "chicken-breast",
    name: "Chicken breast",
    category: "meat",
    defaultServingG: 150,
    co2PerKg: 6.9,
    caloriesPer100g: 165,
    proteinPer100g: 31,
    source: "Poore & Nemecek baseline",
  },
  {
    id: "lentils-cooked",
    name: "Lentils (cooked)",
    category: "legumes",
    defaultServingG: 180,
    co2PerKg: 0.9,
    caloriesPer100g: 116,
    proteinPer100g: 9,
    source: "Poore & Nemecek baseline",
  },
  {
    id: "apple",
    name: "Apple",
    category: "produce",
    defaultServingG: 180,
    co2PerKg: 0.4,
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    source: "Poore & Nemecek baseline",
  },
  {
    id: "whole-milk",
    name: "Whole milk",
    category: "dairy",
    defaultServingG: 250,
    co2PerKg: 1.9,
    caloriesPer100g: 61,
    proteinPer100g: 3.2,
    source: "Poore & Nemecek baseline",
  },
];

export const FOODS_BY_ID: Record<string, Food> = Object.fromEntries(
  SEED_FOODS.map((food) => [food.id, food]),
);
