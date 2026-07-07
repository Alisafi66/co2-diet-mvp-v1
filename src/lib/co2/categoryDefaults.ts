import type { Food, FoodCategory } from "@/types/food";

export interface CategoryNutritionDefaults {
  co2PerKg: number;
  caloriesPer100g: number;
  proteinPer100g: number;
}

/** Baseline per-category values for custom food estimation (Poore & Nemecek–informed). */
export const CATEGORY_DEFAULTS: Record<FoodCategory, CategoryNutritionDefaults> = {
  produce: { co2PerKg: 0.4, caloriesPer100g: 45, proteinPer100g: 1.2 },
  dairy: { co2PerKg: 1.9, caloriesPer100g: 60, proteinPer100g: 3.2 },
  meat: { co2PerKg: 27, caloriesPer100g: 200, proteinPer100g: 20 },
  seafood: { co2PerKg: 5, caloriesPer100g: 120, proteinPer100g: 18 },
  grains: { co2PerKg: 1.2, caloriesPer100g: 130, proteinPer100g: 4 },
  legumes: { co2PerKg: 0.9, caloriesPer100g: 116, proteinPer100g: 9 },
  beverages: { co2PerKg: 0.9, caloriesPer100g: 45, proteinPer100g: 1 },
  processed: { co2PerKg: 2.5, caloriesPer100g: 250, proteinPer100g: 8 },
  other: { co2PerKg: 2, caloriesPer100g: 100, proteinPer100g: 5 },
};

export function buildFoodFromCategory(
  name: string,
  category: FoodCategory,
  defaultServingG: number,
): Food {
  const defaults = CATEGORY_DEFAULTS[category];
  return {
    id: `custom-${crypto.randomUUID()}`,
    name,
    category,
    defaultServingG,
    co2PerKg: defaults.co2PerKg,
    caloriesPer100g: defaults.caloriesPer100g,
    proteinPer100g: defaults.proteinPer100g,
    source: "Category estimate — ReduceCO2Now",
  };
}
