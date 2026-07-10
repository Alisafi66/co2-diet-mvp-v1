"use client";

import type { WeightLog } from "@/hooks/useWeightLogs";

export function WeightTrendMini({ logs }: { logs: WeightLog[] }) {
  // We need at least 2 logs to show a meaningful trend
  if (logs.length < 2) return null; 

  // Grab the last 7 entries for the mini-chart
  const recentLogs = logs.slice(-7); 
  const minWeight = Math.min(...recentLogs.map(l => l.weightKg));
  const maxWeight = Math.max(...recentLogs.map(l => l.weightKg));
  const range = maxWeight - minWeight || 1;

  return (
    <div className="mt-4 pt-4 border-t border-[var(--rcn-border)]">
      <p className="text-xs font-medium text-[var(--rcn-muted)] mb-2">Recent Trend</p>
      <div className="h-12 flex items-end gap-2">
        {recentLogs.map((log) => {
          // Calculate height percentage (minimum 15% so it never fully disappears)
          const heightPct = Math.max(15, ((log.weightKg - minWeight) / range) * 100);
          return (
            <div
              key={log.id}
              title={`${log.weightKg} kg on ${new Date(log.date).toLocaleDateString()}`}
              className="flex-1 rounded-t-sm bg-[var(--rcn-green)]/40 hover:bg-[var(--rcn-green)] transition-colors cursor-pointer"
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}