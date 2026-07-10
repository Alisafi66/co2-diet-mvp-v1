export type FitnessGoal = "lose_weight" | "maintain_weight" | "build_muscle";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface UserProfile {
  id: string;
  displayName?: string;
  /** Primary fitness objective from onboarding */
  goal?: FitnessGoal;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  /** How physically active the user is day-to-day, used for calorie target calc */
  activityLevel?: ActivityLevel;
  /** Opt-in: apply a modest CO2 reduction to the default daily budget */
  reduceCo2Footprint?: boolean;
  /** Computed daily calorie target (kcal) */
  dailyCalorieTarget?: number;
  /** Computed daily protein target (g) */
  dailyProteinTargetG?: number;
  /** Computed daily fat target (g) */
  dailyFatTargetG?: number;
  /** Computed daily carbohydrate target (g) */
  dailyCarbsTargetG?: number;
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