"use client";

import { useCallback, useEffect, useState } from "react";
import type { Food } from "@/types/food";

const FAVORITES_KEY = "rcn_favorite_foods";

function readFavorites(): Record<string, Food> {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored === null) return {};
    return JSON.parse(stored) as Record<string, Food>;
  } catch {
    return {};
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Record<string, Food>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // quota exceeded, etc.
    }
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (foodId: string) => Boolean(favorites[foodId]),
    [favorites],
  );

  const toggleFavorite = useCallback((food: Food) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[food.id]) {
        delete next[food.id];
      } else {
        next[food.id] = food;
      }
      return next;
    });
  }, []);

  return {
    favorites,
    favoritesList: Object.values(favorites),
    hydrated,
    isFavorite,
    toggleFavorite,
  };
}