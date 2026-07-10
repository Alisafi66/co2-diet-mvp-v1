"use client";

import { useEffect, useState } from "react";
import { useReminders } from "@/hooks/useReminders";

export function RemindersCard() {
  const {
    settings,
    notificationPermission,
    requestNotificationPermission,
    updateSettings,
  } = useReminders();

  const [toast, setToast] = useState<{ title: string; body: string } | null>(
    null,
  );

  useEffect(() => {
    function handleInAppReminder(event: Event) {
      const detail = (event as CustomEvent<{ title: string; body: string }>)
        .detail;
      setToast(detail);
      setTimeout(() => setToast(null), 8000);
    }

    window.addEventListener("rcn:in-app-reminder", handleInAppReminder);
    return () =>
      window.removeEventListener("rcn:in-app-reminder", handleInAppReminder);
  }, []);

  return (
    <section
      aria-labelledby="reminders-heading"
      className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-sm"
    >
      <h2
        id="reminders-heading"
        className="text-base font-semibold text-[var(--rcn-text)]"
      >
        Reminders
      </h2>
      <p className="mt-1 text-sm text-[var(--rcn-muted)]">
        Optional, minimal nudges. Only active while the app is open.
      </p>

      {notificationPermission !== "granted" && (
        <button
          type="button"
          onClick={requestNotificationPermission}
          className="mt-3 rounded-xl border border-[var(--rcn-border)] px-3 py-2 text-sm font-medium text-[var(--rcn-green-dark)]"
        >
          Enable browser notifications
        </button>
      )}

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="meal-reminder-toggle"
            className="text-sm font-medium text-[var(--rcn-text)]"
          >
            Meal logging reminder
          </label>
          <div className="flex items-center gap-2">
            <input
              id="meal-reminder-time"
              type="time"
              value={settings.mealReminder.time}
              onChange={(e) =>
                updateSettings({
                  mealReminder: {
                    ...settings.mealReminder,
                    time: e.target.value,
                  },
                })
              }
              disabled={!settings.mealReminder.enabled}
              className="rounded-lg border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-2 py-1 text-sm text-[var(--rcn-text)] disabled:opacity-50"
            />
            <input
              id="meal-reminder-toggle"
              type="checkbox"
              checked={settings.mealReminder.enabled}
              onChange={(e) =>
                updateSettings({
                  mealReminder: {
                    ...settings.mealReminder,
                    enabled: e.target.checked,
                  },
                })
              }
              className="h-4 w-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="weight-reminder-toggle"
            className="text-sm font-medium text-[var(--rcn-text)]"
          >
            Weigh-in reminder
          </label>
          <div className="flex items-center gap-2">
            <input
              id="weight-reminder-time"
              type="time"
              value={settings.weightReminder.time}
              onChange={(e) =>
                updateSettings({
                  weightReminder: {
                    ...settings.weightReminder,
                    time: e.target.value,
                  },
                })
              }
              disabled={!settings.weightReminder.enabled}
              className="rounded-lg border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-2 py-1 text-sm text-[var(--rcn-text)] disabled:opacity-50"
            />
            <input
              id="weight-reminder-toggle"
              type="checkbox"
              checked={settings.weightReminder.enabled}
              onChange={(e) =>
                updateSettings({
                  weightReminder: {
                    ...settings.weightReminder,
                    enabled: e.target.checked,
                  },
                })
              }
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>

      {toast && (
        <div className="mt-4 rounded-xl bg-[var(--rcn-green-soft)] p-3 text-sm text-[var(--rcn-green-dark)]">
          <strong>{toast.title}</strong>
          <p className="mt-0.5">{toast.body}</p>
        </div>
      )}
    </section>
  );
}