"use client";

import { useCallback, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface RecommendationSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

export interface CareerRecommendation {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: string;
  description?: string;
  salaryRange?: string;

  matchScore: number;

  matchedSkills: RecommendationSkill[];
  missingSkills: RecommendationSkill[];
}

interface RecommendationResponse {
  success: boolean;
  data: CareerRecommendation[];
  count?: number;
  message?: string;
  error?: string;
}

// ============================================================
// HOOK
// ============================================================

export default function useRecommendations() {
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // GET RECOMMENDATIONS
  // ==========================================================

  const getRecommendations = useCallback(
    async (skillSlugs: string[]) => {
      if (!skillSlugs.length) {
        setRecommendations([]);
        setError(null);

        return [];
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("skills", skillSlugs.join(","));

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: RecommendationResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to get career recommendations"
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setRecommendations(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to get career recommendations";

        setError(message);
        setRecommendations([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // REFRESH RECOMMENDATIONS
  // ==========================================================

  const refreshRecommendations = useCallback(
    async (skillSlugs: string[]) => {
      return getRecommendations(skillSlugs);
    },
    [getRecommendations]
  );

  // ==========================================================
  // CLEAR RECOMMENDATIONS
  // ==========================================================

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    recommendations,
    loading,
    error,

    getRecommendations,
    refreshRecommendations,

    clearRecommendations,
    clearError,
  };
}