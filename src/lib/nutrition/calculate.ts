import type { Food } from "@/types/food";

export function calculateNutrition(food: Food, quantityG: number) {
  const factor = quantityG / 100;
  return {
    calories: food.caloriesPer100g * factor,
    proteinG: food.proteinPer100g * factor,
  };
}
