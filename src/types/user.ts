export interface UserProfile {
  id: string;
  displayName?: string;
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
