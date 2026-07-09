import type { Food, MealLog } from "@/types/food";
import type { QuantityUnit } from "@/lib/logging/mockFoods";

/** Convert UI quantity + unit to grams for MealLog.quantityG. */
export function toQuantityGrams(
  quantity: number,
  unit: QuantityUnit,
  food: Food,
): number {
  switch (unit) {
    case "g":
      return Math.round(quantity);
    case "ml":
      return Math.round(quantity);
    case "cups":
      return Math.round(quantity * 240);
    case "portions":
      return Math.round(quantity * food.defaultServingG);
    default:
      return Math.round(quantity);
  }
}

export function buildMealLog({
  food,
  quantityG,
  mealType,
}: {
  food: Food;
  quantityG: number;
  mealType: MealLog["mealType"];
}): MealLog {
  return {
    id: crypto.randomUUID(),
    foodId: food.id,
    foodName: food.name,
    quantityG,
    loggedAt: new Date().toISOString(),
    mealType,
  };
}
