export type FitnessGoal = "lose_weight" | "maintain_weight" | "build_muscle";

export interface UserProfile {
  id: string;
  displayName?: string;
  /** Primary fitness objective from onboarding */
  goal?: FitnessGoal;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  /** Computed daily calorie target (kcal) */
  dailyCalorieTarget?: number;
  /** Computed daily protein target (g) */
  dailyProteinTargetG?: number;
  /** Daily CO₂ budget in kg CO₂e (optional goal) */
  dailyCo2BudgetKg?: number;
  dietaryPreferences: ("vegetarian" | "vegan" | "pescatarian" | "omnivore")[];
  units: "metric" | "imperial";
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPreferences {
  analyticsEnabled: boolean;
  aiFeaturesEnabled: boolean;
  dataRetentionDays: number | null; // null = keep forever
}
