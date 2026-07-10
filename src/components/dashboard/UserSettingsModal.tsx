"use client";

import { useState, useId, useEffect } from "react";
import type {
  UserProfile,
  FitnessGoal,
  ActivityLevel,
} from "@/types/user";
import { calculateDailyTargets } from "@/lib/user/calculateTargets";

interface UserSettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "maintain_weight", label: "Maintain weight" },
  { value: "build_muscle", label: "Build muscle" },
];

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary (little to no exercise)" },
  { value: "light", label: "Light (1–3 days/week)" },
  { value: "moderate", label: "Moderate (3–5 days/week)" },
  { value: "active", label: "Active (6–7 days/week)" },
  { value: "very_active", label: "Very active (physical job/2x training)" },
];

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function UserSettingsModal({
  open,
  onClose,
  profile,
  onSave,
}: UserSettingsModalProps) {
  const titleId = useId();

  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [goal, setGoal] = useState<FitnessGoal>("maintain_weight");
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>("moderate");
  const [reduceCo2Footprint, setReduceCo2Footprint] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAge(profile?.age?.toString() ?? "");
    setWeightKg(profile?.weightKg?.toString() ?? "");
    setHeightCm(profile?.heightCm?.toString() ?? "");
    setGoal(profile?.goal ?? "maintain_weight");
    setActivityLevel(profile?.activityLevel ?? "moderate");
    setReduceCo2Footprint(profile?.reduceCo2Footprint ?? false);
  }, [open, profile]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAge = age.trim() === "" ? undefined : Number(age);
    const parsedWeight = weightKg.trim() === "" ? undefined : Number(weightKg);
    const parsedHeight = heightCm.trim() === "" ? undefined : Number(heightCm);

    const targets = calculateDailyTargets({
      age: parsedAge,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      activityLevel,
      goal,
      reduceCo2Footprint,
    });

    const now = new Date().toISOString();

    const nextProfile: UserProfile = {
      id: profile?.id ?? generateId(),
      displayName: profile?.displayName,
      goal,
      age: parsedAge,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      activityLevel,
      reduceCo2Footprint,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      dailyProteinTargetG: targets.dailyProteinTargetG,
      dailyFatTargetG: targets.dailyFatTargetG,
      dailyCarbsTargetG: targets.dailyCarbsTargetG,
      dailyCo2BudgetKg: targets.dailyCo2BudgetKg,
      dietaryPreferences: profile?.dietaryPreferences ?? [],
      units: profile?.units ?? "metric",
      createdAt: profile?.createdAt ?? now,
      updatedAt: now,
    };

    onSave(nextProfile);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Your Settings
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Used to personalize your daily targets. Everything here stays on
          your device.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">Age</span>
              <input
                type="number"
                min="1"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">Weight (kg)</span>
              <input
                type="number"
                step="0.1"
                min="1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
                className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">Height (cm)</span>
              <input
                type="number"
                min="1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="170"
                className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Goal</span>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as FitnessGoal)}
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
            >
              {GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Activity level</span>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
            >
              {ACTIVITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-[var(--rcn-text)]">
            <input
              type="checkbox"
              checked={reduceCo2Footprint}
              onChange={(e) => setReduceCo2Footprint(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--rcn-border)]"
            />
            Set a slightly lower CO₂ budget to encourage reduction
          </label>

          <p className="text-xs text-[var(--rcn-muted)]">
            Age, weight, and height are optional — without them we'll use a
            general default target instead of a personalized one.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 flex-1 rounded-xl border border-[var(--rcn-border)] text-sm font-medium text-[var(--rcn-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-12 flex-1 rounded-xl bg-[var(--rcn-green)] text-sm font-medium text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}