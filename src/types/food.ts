export type FoodCategory =
  | "produce"
  | "dairy"
  | "meat"
  | "seafood"
  | "grains"
  | "legumes"
  | "beverages"
  | "processed"
  | "other";

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  /** Grams per default serving */
  defaultServingG: number;
  /** kg CO₂e per kg of product (lifecycle) */
  co2PerKg: number;
  /** kcal per 100g */
  caloriesPer100g: number;
  proteinPer100g: number;
  source?: string;
}

export interface MealLog {
  id: string;
  foodId: string;
  foodName: string;
  quantityG: number;
  loggedAt: string; // ISO 8601
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}
