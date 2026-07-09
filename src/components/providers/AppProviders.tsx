"use client";

import { MealLogsProvider } from "@/hooks/MealLogsProvider";
import { UserProvider } from "@/hooks/UserProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <MealLogsProvider>{children}</MealLogsProvider>
    </UserProvider>
  );
}
