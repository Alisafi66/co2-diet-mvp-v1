import type { FitnessGoal, UserProfile } from "@/types/user";
import {
  calculateDailyCalorieTarget,
  calculateDailyProteinTarget,
} from "@/lib/nutrition/bmr";

export interface OnboardingInput {
  goal: FitnessGoal;
  age: number;
  weightKg: number;
  heightCm: number;
}

export function buildUserProfileFromOnboarding(
  input: OnboardingInput,
  existing?: UserProfile | null,
): UserProfile {
  const now = new Date().toISOString();
  const metrics = {
    age: input.age,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
  };

  return {
    id: existing?.id ?? crypto.randomUUID(),
    goal: input.goal,
    age: input.age,
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    dailyCalorieTarget: calculateDailyCalorieTarget(metrics, input.goal),
    dailyProteinTargetG: calculateDailyProteinTarget(input.weightKg, input.goal),
    dailyCo2BudgetKg: existing?.dailyCo2BudgetKg ?? 3.8,
    displayName: existing?.displayName,
    dietaryPreferences: existing?.dietaryPreferences ?? [],
    units: "metric",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
