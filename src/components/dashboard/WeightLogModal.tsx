"use client";

import { useState, useId, useEffect } from "react";

interface WeightLogModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (weightKg: number) => void;
}

export function WeightLogModal({ open, onClose, onAdd }: WeightLogModalProps) {
  const titleId = useId();
  const [weight, setWeight] = useState("");

  // Clear the input field every time the modal opens
  useEffect(() => {
    if (open) setWeight(""); 
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(weight);
    if (!isNaN(num) && num > 0) {
      onAdd(num);
      onClose();
    }
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
        className="w-full max-w-md rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold text-[var(--rcn-text)]">
          Log Weight
        </h2>
        <p className="mt-1 text-sm text-[var(--rcn-muted)]">
          Track your progress over time.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-[var(--rcn-text)]">Weight (kg)</span>
            <input
              type="number"
              step="0.1"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 70.5"
              className="min-h-12 rounded-xl border border-[var(--rcn-border)] bg-[var(--rcn-bg)] px-3 text-[var(--rcn-text)]"
              autoFocus
              required
            />
          </label>

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