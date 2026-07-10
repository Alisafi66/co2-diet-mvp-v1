"use client";

import { useLocalStorage } from "./useLocalStorage";

export interface WeightLog {
  id: string;
  weightKg: number;
  date: string;
}

export function useWeightLogs() {
  const [weightLogs, setWeightLogs] = useLocalStorage<WeightLog[]>("rcn_weight_logs", []);

  const addWeightLog = (weightKg: number) => {
    const newLog: WeightLog = {
      id: crypto.randomUUID(),
      weightKg,
      date: new Date().toISOString(),
    };

    setWeightLogs((prevLogs) => {
      // Keep the list sorted chronologically
      const updated = [...prevLogs, newLog];
      return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  };

  return { weightLogs, addWeightLog };
}