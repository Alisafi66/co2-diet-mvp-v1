import { estimateCo2 } from "@/lib/co2/estimate";
import { calculateNutrition } from "@/lib/nutrition/calculate";
import type { Co2Impact, DailyCo2Summary } from "@/types/co2";
import type { Food, MealLog } from "@/types/food";

export interface DailyNutritionSummary {
  calories: number;
  proteinG: number;
}

export interface MealEntryDetail {
  log: MealLog;
  food: Food | null;
  co2: Co2Impact;
  nutrition: DailyNutritionSummary;
}

export interface DayTrendPoint {
  date: string;
  totalKg: number;
  calories: number;
}

export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function filterLogsByDate(logs: MealLog[], dateKey: string): MealLog[] {
  return logs.filter((log) => log.loggedAt.startsWith(dateKey));
}

function resolveFood(
  log: MealLog,
  foodsById: Record<string, Food>,
): Food | null {
  return foodsById[log.foodId] ?? null;
}

export function buildMealEntryDetail(
  log: MealLog,
  foodsById: Record<string, Food>,
): MealEntryDetail {
  const food = resolveFood(log, foodsById);
  const fallbackFood: Food = food ?? {
    id: log.foodId,
    name: log.foodName,
    category: "other",
    defaultServingG: log.quantityG,
    co2PerKg: 2,
    caloriesPer100g: 100,
    proteinPer100g: 5,
  };

  const co2 = estimateCo2(fallbackFood, log.quantityG);
  const nutrition = calculateNutrition(fallbackFood, log.quantityG);

  return { log, food, co2, nutrition };
}

export function summarizeDay(
  logs: MealLog[],
  foodsById: Record<string, Food>,
  dateKey: string,
): {
  co2: DailyCo2Summary;
  nutrition: DailyNutritionSummary;
  entries: MealEntryDetail[];
} {
  const dayLogs = filterLogsByDate(logs, dateKey);
  const entries = dayLogs.map((log) => buildMealEntryDetail(log, foodsById));

  const byCategory: Record<string, number> = {};
  let totalKg = 0;
  let calories = 0;
  let proteinG = 0;

  for (const entry of entries) {
    totalKg += entry.co2.totalKg;
    calories += entry.nutrition.calories;
    proteinG += entry.nutrition.proteinG;

    const category = entry.food?.category ?? "other";
    byCategory[category] = (byCategory[category] ?? 0) + entry.co2.totalKg;
  }

  return {
    co2: {
      date: dateKey,
      totalKg,
      mealCount: dayLogs.length,
      byCategory,
    },
    nutrition: { calories, proteinG },
    entries,
  };
}

export function summarizeWeek(
  logs: MealLog[],
  foodsById: Record<string, Food>,
  endDate: Date = new Date(),
): DayTrendPoint[] {
  const points: DayTrendPoint[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - offset);
    const dateKey = getDateKey(date);
    const { co2, nutrition } = summarizeDay(logs, foodsById, dateKey);
    points.push({
      date: dateKey,
      totalKg: co2.totalKg,
      calories: nutrition.calories,
    });
  }

  return points;
}

export function findHighestCo2MealType(
  entries: MealEntryDetail[],
): MealLog["mealType"] | null {
  if (entries.length === 0) return null;

  const totals: Record<MealLog["mealType"], number> = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  };

  for (const entry of entries) {
    totals[entry.log.mealType] += entry.co2.totalKg;
  }

  return (
    Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0] as
      | MealLog["mealType"]
      | undefined
  ) ?? null;
}
