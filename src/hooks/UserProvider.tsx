"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { UserProfile } from "@/types/user";
import { buildUserProfileFromOnboarding } from "@/lib/user/buildProfile";
import type { OnboardingInput } from "@/lib/user/buildProfile";

const PROFILE_KEY = "rcn_user_profile";

interface UserContextValue {
  profile: UserProfile | null;
  hydrated: boolean;
  saveOnboarding: (input: OnboardingInput) => UserProfile;
  updateProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

function readProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored === null) return null;
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (profile === null) {
        localStorage.removeItem(PROFILE_KEY);
      } else {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      }
    } catch {
      // quota exceeded, etc.
    }
  }, [profile, hydrated]);

  const saveOnboarding = useCallback(
    (input: OnboardingInput): UserProfile => {
      const next = buildUserProfileFromOnboarding(input, profile);
      setProfile(next);
      return next;
    },
    [profile],
  );

  const updateProfile = useCallback((next: UserProfile) => {
    setProfile({ ...next, updatedAt: new Date().toISOString() });
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      hydrated,
      saveOnboarding,
      updateProfile,
      clearProfile,
    }),
    [profile, hydrated, saveOnboarding, updateProfile, clearProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserProfile(): UserContextValue {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUserProfile must be used within a UserProvider");
  }
  return context;
}
