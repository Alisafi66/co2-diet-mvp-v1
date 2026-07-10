"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_REMINDER_SETTINGS,
  type ReminderSettings,
} from "@/types/reminders";

const REMINDERS_KEY = "rcn_reminders";

function readSettings(): ReminderSettings {
  try {
    const stored = localStorage.getItem(REMINDERS_KEY);
    if (stored === null) return DEFAULT_REMINDER_SETTINGS;
    return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;
}

function notify(title: string, body: string) {
  if (typeof window === "undefined") return;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  } else {
    // Fallback: dispatch a custom event the UI can listen for and show as
    // an in-app toast/banner instead of a browser-level notification.
    window.dispatchEvent(
      new CustomEvent("rcn:in-app-reminder", { detail: { title, body } }),
    );
  }
}

export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(
    DEFAULT_REMINDER_SETTINGS,
  );
  const [hydrated, setHydrated] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    setSettings(readSettings());
    setHydrated(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(settings));
    } catch {
      // quota exceeded, etc.
    }
  }, [settings, hydrated]);

  // Check every 30s whether it's time to fire a reminder. This only works
  // while the app is open in a tab — no background/push support yet.
  useEffect(() => {
    if (!hydrated) return;

    const interval = setInterval(() => {
      const current = settingsRef.current;
      const nowHHMM = getCurrentHHMM();
      const today = getTodayKey();

      if (
        current.mealReminder.enabled &&
        current.mealReminder.time === nowHHMM &&
        current.lastFiredDate.meal !== today
      ) {
        notify("Time to log a meal", "Quick log keeps your tracking accurate.");
        setSettings((prev) => ({
          ...prev,
          lastFiredDate: { ...prev.lastFiredDate, meal: today },
        }));
      }

      if (
        current.weightReminder.enabled &&
        current.weightReminder.time === nowHHMM &&
        current.lastFiredDate.weight !== today
      ) {
        notify("Weigh-in reminder", "Log today's weight to track your trend.");
        setSettings((prev) => ({
          ...prev,
          lastFiredDate: { ...prev.lastFiredDate, weight: today },
        }));
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [hydrated]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setNotificationPermission(result);
  }, []);

  const updateSettings = useCallback((next: Partial<ReminderSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  }, []);

  return {
    settings,
    hydrated,
    notificationPermission,
    requestNotificationPermission,
    updateSettings,
  };
}