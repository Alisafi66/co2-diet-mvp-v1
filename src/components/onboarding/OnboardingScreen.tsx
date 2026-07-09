"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FitnessGoal } from "@/types/user";
import { useUserProfile } from "@/hooks/UserProvider";

const GOALS: { id: FitnessGoal; title: string; description: string }[] = [
  {
    id: "lose_weight",
    title: "Lose Weight",
    description: "A gentle calorie deficit to support steady progress.",
  },
  {
    id: "maintain_weight",
    title: "Maintain Weight",
    description: "Balance intake with your daily energy needs.",
  },
  {
    id: "build_muscle",
    title: "Build Muscle",
    description: "Higher protein and a modest calorie surplus.",
  },
];

const inputClassName =
  "min-h-12 w-full rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-4 text-[var(--rcn-text)] outline-none focus:border-[var(--rcn-green)] focus:ring-2 focus:ring-[var(--rcn-green)]/20";

export function OnboardingScreen() {
  const router = useRouter();
  const { saveOnboarding } = useUserProfile();
  const [step, setStep] = useState<1 | 2>(1);
  const [goal, setGoal] = useState<FitnessGoal | null>(null);
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const handleContinueFromObjective = () => {
    if (goal) setStep(2);
  };

  const handleComplete = (event: React.FormEvent) => {
    event.preventDefault();
    if (!goal) return;

    const parsedAge = Number(age);
    const parsedWeight = Number(weightKg);
    const parsedHeight = Number(heightCm);

    if (
      !Number.isFinite(parsedAge) ||
      parsedAge < 16 ||
      parsedAge > 120 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0 ||
      !Number.isFinite(parsedHeight) ||
      parsedHeight <= 0
    ) {
      return;
    }

    saveOnboarding({
      goal,
      age: parsedAge,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
    });

    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-[var(--rcn-bg)] px-4 py-8">
      <header className="mb-8 text-center">
        <p className="text-sm font-medium text-[var(--rcn-green-dark)]">
          Step {step} of 2
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--rcn-text)]">
          {step === 1 ? "What is your goal?" : "Your baseline metrics"}
        </h1>
        <p className="mt-2 text-sm text-[var(--rcn-muted)]">
          Stored only on this device. No gender data collected.
        </p>
      </header>

      {step === 1 ? (
        <div className="flex flex-1 flex-col gap-4">
          {GOALS.map((option) => {
            const selected = goal === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setGoal(option.id)}
                className={`rounded-2xl border p-5 text-left shadow-sm transition-colors ${
                  selected
                    ? "border-[var(--rcn-green)] bg-[var(--rcn-green-soft)]/50 ring-1 ring-[var(--rcn-green)]/30"
                    : "border-[var(--rcn-border)] bg-[var(--rcn-surface)] hover:border-[var(--rcn-green)]/50"
                }`}
              >
                <p className="text-lg font-semibold text-[var(--rcn-text)]">
                  {option.title}
                </p>
                <p className="mt-1 text-sm text-[var(--rcn-muted)]">
                  {option.description}
                </p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={handleContinueFromObjective}
            disabled={!goal}
            className="mt-4 min-h-14 rounded-2xl bg-[var(--rcn-green-dark)] text-base font-semibold text-white transition-colors hover:bg-[var(--rcn-green)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      ) : (
        <form onSubmit={handleComplete} className="flex flex-1 flex-col gap-5">
          <div className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-sm">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">
                Age (years)
              </span>
              <input
                type="number"
                min={16}
                max={120}
                step={1}
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="e.g. 30"
                className={inputClassName}
                required
              />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">
                Weight (kg)
              </span>
              <input
                type="number"
                min={1}
                step={0.1}
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                placeholder="e.g. 72"
                className={inputClassName}
                required
              />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--rcn-text)]">
                Height (cm)
              </span>
              <input
                type="number"
                min={1}
                step={1}
                value={heightCm}
                onChange={(event) => setHeightCm(event.target.value)}
                placeholder="e.g. 175"
                className={inputClassName}
                required
              />
            </label>
          </div>

          <p className="text-xs text-[var(--rcn-muted)]">
            We use a gender-neutral BMR estimate to calculate your daily calorie
            and protein targets. You can adjust these later.
          </p>

          <div className="mt-auto flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-14 flex-1 rounded-2xl border border-[var(--rcn-border)] text-base font-medium text-[var(--rcn-muted)]"
            >
              Back
            </button>
            <button
              type="submit"
              className="min-h-14 flex-[2] rounded-2xl bg-[var(--rcn-green-dark)] px-6 text-base font-semibold text-white hover:bg-[var(--rcn-green)]"
            >
              Finish
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
