import type { Food, MealLog } from "@/types/food";

export interface RecentFoodPick {
  foodId: string;
  foodName: string;
  quantityG: number;
  food?: Food;
}

/**
 * Derives a "recent foods" list from meal history — most recently logged
 * unique foods first, capped at `limit`. No separate storage needed since
 * this reads directly from existing meal logs.
 */
export function getRecentFoods(
  logs: MealLog[],
  foodsById: Record<string, Food>,
  limit = 5,
): RecentFoodPick[] {
  const seen = new Set<string>();
  const picks: RecentFoodPick[] = [];

  for (let i = logs.length - 1; i >= 0 && picks.length < limit; i -= 1) {
    const log = logs[i];
    if (seen.has(log.foodId)) continue;
    seen.add(log.foodId);
    picks.push({
      foodId: log.foodId,
      foodName: log.foodName,
      quantityG: log.quantityG,
      food: foodsById[log.foodId],
    });
  }

  return picks;
}