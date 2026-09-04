"use client";

import { useEffect, useState, useCallback } from "react";
import { useClient } from "@/lib/store";
import { api, apiFetch, handleResponse } from "@/lib/api";

type ApiResult<T> = {
  data?: T | null;
  loading: boolean;
  error?: string | null;
};

async function fetchJson<T>(url: string, opts?: RequestInit) {
  const res = await apiFetch(url, opts);
  return handleResponse<T>(res);
}

export function useApiGet<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchJson<T>(url)
      .then((d) => mounted && setData(d))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error } as ApiResult<T>;
}

export function useApiPost<T = any>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = useClient();

  const post = useCallback(async (body?: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<T>(url, body);
      // Refresh user state after mutations so XP/coins reflect immediately
      try {
        await client.refreshUser();
      } catch (e) {
        // ignore refresh errors here
      }
      return data;
    } catch (err: any) {
      setError(err?.message || String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, client]);

  return { post, loading, error } as { post: (body?: unknown) => Promise<T>; loading: boolean; error?: string | null };
}

// Specific hooks
export function useCurrentUser() {
  return useApiGet<{ user: any; token?: string }>("/api/auth/me");
}

export function useChallenges() {
  return useApiGet<any[]>("/api/challenges");
}

export function useLessons() {
  return useApiGet<any[]>('/api/lessons');
}

export function useAchievements() {
  return useApiGet<any[]>('/api/achievements');
}

export function useProgress() {
  return useApiGet<any[]>('/api/progress');
}

export function useRecentActivity() {
  return useApiGet<any[]>('/api/activity');
}

export function useNotes() {
  const create = useApiPost<any>("/api/notes");
  return { create, list: useApiGet<any[]>("/api/notes") };
}

export function useBookmarks() {
  const add = useApiPost<any>("/api/bookmarks");
  return { add, list: useApiGet<any>("/api/bookmarks") };
}

export function useSubmitChallenge() {
  return useApiPost<any>("/api/challenges/submit");
}

export function useSubmitProgress() {
  return useApiPost<any>("/api/progress");
}
