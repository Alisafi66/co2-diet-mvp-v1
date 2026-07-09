"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Food, MealLog } from "@/types/food";

const LOGS_KEY = "rcn_meal_logs";
const CUSTOM_FOODS_KEY = "rcn_custom_foods";
const LEGACY_LOGS_KEY = "reduceco2now:meal-logs";
const LEGACY_CUSTOM_FOODS_KEY = "reduceco2now:custom-foods";

interface MealLogsContextValue {
  logs: MealLog[];
  customFoods: Record<string, Food>;
  hydrated: boolean;
  addMeal: (meal: MealLog) => void;
  addCustomFood: (food: Food) => void;
  addCustomMeal: (meal: MealLog, food: Food) => void;
  removeMeal: (id: string) => void;
}

const MealLogsContext = createContext<MealLogsContextValue | null>(null);

function readStorage<T>(key: string, legacyKey: string): T | null {
  try {
    const stored = localStorage.getItem(key) ?? localStorage.getItem(legacyKey);
    if (stored === null) return null;
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

export function MealLogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [customFoods, setCustomFoods] = useState<Record<string, Food>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedLogs = readStorage<MealLog[]>(LOGS_KEY, LEGACY_LOGS_KEY);
    if (storedLogs !== null) setLogs(storedLogs);

    const storedFoods = readStorage<Record<string, Food>>(
      CUSTOM_FOODS_KEY,
      LEGACY_CUSTOM_FOODS_KEY,
    );
    if (storedFoods !== null) setCustomFoods(storedFoods);

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

  const value = useMemo(
    () => ({
      logs,
      customFoods,
      hydrated,
      addMeal,
      addCustomFood,
      addCustomMeal,
      removeMeal,
    }),
    [
      logs,
      customFoods,
      hydrated,
      addMeal,
      addCustomFood,
      addCustomMeal,
      removeMeal,
    ],
  );

  return (
    <MealLogsContext.Provider value={value}>{children}</MealLogsContext.Provider>
  );
}

export function useMealLogs(): MealLogsContextValue {
  const context = useContext(MealLogsContext);
  if (context === null) {
    throw new Error("useMealLogs must be used within a MealLogsProvider");
  }
  return context;
}
