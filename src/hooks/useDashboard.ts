"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  DashboardStats,
  DashboardStatsResponse,
} from "@/src/types/dashboard";

const DEFAULT_STATS: DashboardStats = {
  roles: 0,
  skills: 0,
  relationships: 0,
  categories: 0,
};

type UseDashboardReturn = {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export default function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/dashboard/stats", {
          method: "GET",
          cache: "no-store",
          signal,
        });

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Dashboard API returned an invalid response (${response.status})`,
          );
        }

        const result: DashboardStatsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch dashboard statistics",
          );
        }

        const data = result.data;

        setStats({
          roles: Number(data?.roles ?? 0),
          skills: Number(data?.skills ?? 0),
          relationships: Number(data?.relationships ?? 0),
          categories: Number(data?.categories ?? 0),
        });
      } catch (err) {
        // Ignore cancelled requests
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load dashboard statistics";

        setError(message);
        setStats(DEFAULT_STATS);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    void fetchDashboardStats(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDashboardStats]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    stats,
    loading,
    error,
    refetch,
  };
}