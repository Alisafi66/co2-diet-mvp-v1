"use client";

import { useCallback, useEffect, useState } from "react";
import type { Food, MealLog } from "@/types/food";

const LOGS_KEY = "reduceco2now:meal-logs";
const CUSTOM_FOODS_KEY = "reduceco2now:custom-foods";

export function useMealLogs() {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [customFoods, setCustomFoods] = useState<Record<string, Food>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(LOGS_KEY);
      if (storedLogs !== null) {
        setLogs(JSON.parse(storedLogs) as MealLog[]);
      }

      const storedFoods = localStorage.getItem(CUSTOM_FOODS_KEY);
      if (storedFoods !== null) {
        setCustomFoods(JSON.parse(storedFoods) as Record<string, Food>);
      }
    } catch {
      // ignore parse errors; start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
    } catch {
      // quota exceeded, etc.
    }
  }, [logs, customFoods, hydrated]);

  const addCustomFood = useCallback((food: Food) => {
    setCustomFoods((prev) => ({ ...prev, [food.id]: food }));
  }, []);

  const addMeal = useCallback((meal: MealLog) => {
    setLogs((prev) => [...prev, meal]);
  }, []);

  const addCustomMeal = useCallback((meal: MealLog, food: Food) => {
    setCustomFoods((prev) => ({ ...prev, [food.id]: food }));
    setLogs((prev) => [...prev, meal]);
  }, []);

  const removeMeal = useCallback((id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  return {
    logs,
    customFoods,
    addMeal,
    addCustomFood,
    addCustomMeal,
    removeMeal,
    hydrated,
  };
}
