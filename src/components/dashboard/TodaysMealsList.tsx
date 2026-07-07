import {
  capitalizeMealType,
  formatCalories,
  formatCo2Kg,
  formatProtein,
} from "@/lib/dashboard/format";
import type { MealEntryDetail } from "@/lib/dashboard/summarize";

interface TodaysMealsListProps {
  entries: MealEntryDetail[];
  onEditMeal?: (logId: string) => void;
}

export function TodaysMealsList({ entries, onEditMeal }: TodaysMealsListProps) {
  if (entries.length === 0) {
    return (
      <section
        aria-labelledby="todays-meals-heading"
        className="rounded-2xl border border-dashed border-[var(--rcn-border)] bg-[var(--rcn-surface)] px-5 py-8 text-center"
      >
        <h2
          id="todays-meals-heading"
          className="text-base font-semibold text-[var(--rcn-text)]"
        >
          Today&apos;s meals
        </h2>
        <p className="mt-2 text-sm text-[var(--rcn-muted)]">
          No meals yet — start logging when you&apos;re ready.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="todays-meals-heading">
      <h2
        id="todays-meals-heading"
        className="mb-3 text-base font-semibold text-[var(--rcn-text)]"
      >
        Today&apos;s meals
      </h2>
      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.log.id}>
            <article className="rounded-2xl border border-[var(--rcn-border)] bg-[var(--rcn-surface)] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--rcn-green-dark)]">
                    {capitalizeMealType(entry.log.mealType)}
                  </p>
                  <h3 className="mt-0.5 font-medium text-[var(--rcn-text)]">
                    {entry.log.foodName}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--rcn-muted)]">
                    {entry.log.quantityG} g
                  </p>
                </div>
                {onEditMeal ? (
                  <button
                    type="button"
                    onClick={() => onEditMeal(entry.log.id)}
                    className="min-h-11 min-w-11 rounded-xl px-3 text-sm font-medium text-[var(--rcn-green-dark)] hover:bg-[var(--rcn-green-soft)]"
                  >
                    Edit
                  </button>
                ) : null}
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--rcn-muted)]">
                <div>
                  <dt className="sr-only">CO₂</dt>
                  <dd>{formatCo2Kg(entry.co2.totalKg)} CO₂</dd>
                </div>
                <div>
                  <dt className="sr-only">Calories</dt>
                  <dd>{formatCalories(entry.nutrition.calories)}</dd>
                </div>
                <div>
                  <dt className="sr-only">Protein</dt>
                  <dd>{formatProtein(entry.nutrition.proteinG)} protein</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
