export interface Co2Impact {
  /** kg CO₂e for this portion */
  totalKg: number;
  /** Compared to category average (1.0 = average) */
  relativeToCategory?: number;
  methodology: "category-default" | "product-specific" | "user-override";
  source?: string;
}

export interface DailyCo2Summary {
  date: string; // YYYY-MM-DD
  totalKg: number;
  mealCount: number;
  byCategory: Record<string, number>;
}
