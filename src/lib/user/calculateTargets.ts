import type { ActivityLevel, FitnessGoal } from "@/types/user";

export interface TargetInput {
  age?: number;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: ActivityLevel;
  goal?: FitnessGoal;
  reduceCo2Footprint?: boolean;
}

export interface DailyTargets {
  dailyCalorieTarget: number;
  dailyProteinTargetG: number;
  dailyFatTargetG: number;
  dailyCarbsTargetG: number;
  dailyCo2BudgetKg: number;
}

/**
 * FR-012 — Daily Target Calculations.
 *
 * Calorie baseline: Mifflin-St Jeor BMR formula, using a gender-neutral constant
 * (average of the male +5 and female -161 constants → -78), consistent with the
 * app's privacy-first decision to exclude sex/gender from the user profile.
 *   BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 78
 *
 * Activity multipliers follow the standard Harris-Benedict activity scale.
 *
 * Protein: bodyweight-based guideline (g per kg), adjusted by goal —
 * higher for muscle building and for weight loss (to preserve lean mass in a deficit).
 *
 * Fat: 25% of total calories. Carbs: remainder.
 *
 * CO2 budget: NOT scientifically derived per-user (no reliable individual model
 * exists yet). Uses a flat estimated baseline consistent with the app's existing
 * DEFAULT_TARGETS (3.8 kg/day), with an optional modest reduction if the user
 * opts into a CO2 reduction goal. This should be revisited once real regional/
 * dietary CO2 estimation logic (src/lib/co2/) is more mature.
 */
export function calculateDailyTargets(input: TargetInput): DailyTargets {
  const {
    age,
    weightKg,
    heightCm,
    activityLevel = "moderate",
    goal = "maintain_weight",
    reduceCo2Footprint = false,
  } = input;

  const hasEnoughDataForBmr =
    typeof age === "number" &&
    typeof weightKg === "number" &&
    typeof heightCm === "number";

  const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const GOAL_CALORIE_ADJUSTMENT: Record<FitnessGoal, number> = {
    lose_weight: -500,
    maintain_weight: 0,
    build_muscle: 300,
  };

  const PROTEIN_G_PER_KG: Record<FitnessGoal, number> = {
    lose_weight: 1.6,
    maintain_weight: 1.2,
    build_muscle: 1.8,
  };

  // Fallback baseline if profile is incomplete — keeps existing DEFAULT_TARGETS
  // values as a safety net rather than returning nonsensical numbers.
  if (!hasEnoughDataForBmr) {
    return {
      dailyCalorieTarget: 2100,
      dailyProteinTargetG: 95,
      dailyFatTargetG: Math.round((2100 * 0.25) / 9),
      dailyCarbsTargetG: Math.round((2100 * 0.75) / 4),
      dailyCo2BudgetKg: reduceCo2Footprint ? 3.2 : 3.8,
    };
  }

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const dailyCalorieTarget = Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[goal]);

  const dailyProteinTargetG = Math.round(weightKg * PROTEIN_G_PER_KG[goal]);

  const fatCalories = dailyCalorieTarget * 0.25;
  const dailyFatTargetG = Math.round(fatCalories / 9);

  const proteinCalories = dailyProteinTargetG * 4;
  const remainingCalories = Math.max(
    dailyCalorieTarget - fatCalories - proteinCalories,
    0,
  );
  const dailyCarbsTargetG = Math.round(remainingCalories / 4);

  const dailyCo2BudgetKg = reduceCo2Footprint ? 3.2 : 3.8;

  return {
    dailyCalorieTarget,
    dailyProteinTargetG,
    dailyFatTargetG,
    dailyCarbsTargetG,
    dailyCo2BudgetKg,
  };
}