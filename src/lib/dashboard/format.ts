export function formatCo2Kg(kg: number): string {
  if (kg < 0.1) return `${(kg * 1000).toFixed(0)} g`;
  return `${kg.toFixed(1)} kg`;
}

export function formatCalories(kcal: number): string {
  return `${Math.round(kcal).toLocaleString()} kcal`;
}

export function formatProtein(g: number): string {
  return `${Math.round(g)} g`;
}

export function formatShortDate(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}

export function capitalizeMealType(
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
): string {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
}
