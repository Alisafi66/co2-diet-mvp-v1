import type { Food } from "@/types/food";
import type { Co2Impact } from "@/types/co2";

/** Estimate CO₂e for a given food portion (kg CO₂e). */
export function estimateCo2(food: Food, quantityG: number): Co2Impact {
  const totalKg = (food.co2PerKg * quantityG) / 1000;
  return {
    totalKg,
    methodology: "product-specific",
    source: food.source ?? "ReduceCO2Now default factors",
  };
}
