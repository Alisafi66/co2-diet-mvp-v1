import type { FitnessGoal } from "@/types/user";

export interface BaselineMetrics {
  age: number;
  weightKg: number;
  heightCm: number;
}

/**
 * Gender-neutral BMR using the average of Mifflin-St Jeor male/female formulas.
 * BMR = 10×weight(kg) + 6.25×height(cm) − 5×age − 78
 */
export function calculateNeutralBmr({
  age,
  weightKg,
  heightCm,
}: BaselineMetrics): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 78;
}

/** Light-moderate activity multiplier (onboarding does not collect activity level). */
const DEFAULT_ACTIVITY_FACTOR = 1.375;

const GOAL_CALORIE_ADJUSTMENT: Record<FitnessGoal, number> = {
  lose_weight: -500,
  maintain_weight: 0,
  build_muscle: 300,
};

const GOAL_PROTEIN_PER_KG: Record<FitnessGoal, number> = {
  lose_weight: 1.2,
  maintain_weight: 0.8,
  build_muscle: 1.8,
};

const MIN_DAILY_CALORIES = 1200;

export function calculateDailyCalorieTarget(
  metrics: BaselineMetrics,
  goal: FitnessGoal,
): number {
  const bmr = calculateNeutralBmr(metrics);
  const tdee = bmr * DEFAULT_ACTIVITY_FACTOR;
  const target = Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[goal]);
  return Math.max(MIN_DAILY_CALORIES, target);
}

export function calculateDailyProteinTarget(
  weightKg: number,
  goal: FitnessGoal,
): number {
  return Math.round(weightKg * GOAL_PROTEIN_PER_KG[goal]);
}
