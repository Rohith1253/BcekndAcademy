"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getApiUrl } from "./http";

type User = any;

type ClientState = {
  user: User | null;
  loading: boolean;
  error?: string | null;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addAchievement: (ach: any) => void;
};

const StoreContext = createContext<ClientState | undefined>(undefined);

export function setClientAuthToken(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
    try {
      localStorage.setItem("token", token);
    } catch {}
  }
}

export function clearClientAuthToken() {
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    try {
      localStorage.removeItem("token");
    } catch {}
  }
}

async function fetchMe(): Promise<{ user?: User; error?: string }> {
  try {
    const headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }
    }

    const res = await fetch(getApiUrl("/api/auth/me"), {
      headers,
      credentials: "include",
    });

    if (res.status === 401) {
      clearClientAuthToken();
      return { user: null };
    }

    const json = await res.json();
    const userObj = json.data?.user || json.data;
    return { user: userObj };
  } catch (err: any) {
    return { error: err?.message || String(err) };
  }
}

export function ClientStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchMe();
    if (result.error) setError(result.error);
    setUser(result.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const setUserSafe = useCallback((u: User | null) => setUser(u), []);

  const addXP = useCallback((amount: number) => {
    setUser((prev: User | null) => {
      if (!prev) return prev;
      return { ...prev, totalXP: (prev.totalXP || 0) + amount };
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setUser((prev: User | null) => {
      if (!prev) return prev;
      return { ...prev, coins: (prev.coins || 0) + amount };
    });
  }, []);

  const addAchievement = useCallback((ach: any) => {
    setUser((prev: User | null) => {
      if (!prev) return prev;
      const cur = prev.achievements || [];
      return { ...prev, achievements: [...cur, ach] };
    });
  }, []);

  const value: ClientState = {
    user,
    loading,
    error,
    refreshUser,
    setUser: setUserSafe,
    addXP,
    addCoins,
    addAchievement,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useClient() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useClient must be used within ClientStateProvider");
  return ctx;
}

export default ClientStateProvider;
