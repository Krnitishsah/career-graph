"use client";

import { useCallback, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface CareerSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

export interface CareerRole {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: string;
  description?: string;
  salaryRange?: string;
  matchScore?: number;
  matchedSkills?: CareerSkill[];
  missingSkills?: CareerSkill[];
}

export interface GraphNode {
  id: string;
  label: string;
  properties: Record<string, unknown>;
}

export interface GraphRelationship {
  id: string;
  type: string;
  source: string;
  target: string;
  properties: Record<string, unknown>;
}

export interface CareerGraph {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

export interface GraphStats {
  skillCount: number;
  roleCount: number;
  relationshipCount: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

// ============================================================
// HOOK
// ============================================================

export function useCareerGraph() {
  const [skills, setSkills] = useState<CareerSkill[]>([]);
  const [roles, setRoles] = useState<CareerRole[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // ERROR HANDLER
  // ==========================================================

  const getErrorMessage = (
    err: unknown,
    fallback: string,
  ) => {
    return err instanceof Error
      ? err.message
      : fallback;
  };

  // ==========================================================
  // GET SKILLS
  // ==========================================================

  const getSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/skills", {
        method: "GET",
        cache: "no-store",
      });

      const result: ApiResponse<CareerSkill[]> =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch skills",
        );
      }

      const data = result.data ?? [];

      setSkills(data);

      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to fetch skills",
      );

      setError(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // SEARCH SKILLS
  // ==========================================================

  const searchSkills = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        const cleanQuery = query.trim();

        if (cleanQuery) {
          params.set("search", cleanQuery);
        }

        const queryString = params.toString();

        const response = await fetch(
          `/api/skills${
            queryString ? `?${queryString}` : ""
          }`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerSkill[]> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to search skills",
          );
        }

        const data = result.data ?? [];

        setSkills(data);

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to search skills",
        );

        setError(message);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GET ROLES
  // ==========================================================

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/roles", {
        method: "GET",
        cache: "no-store",
      });

      const result: ApiResponse<CareerRole[]> =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch roles",
        );
      }

      const data = result.data ?? [];

      setRoles(data);

      return data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to fetch roles",
      );

      setError(message);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // SEARCH ROLES
  // ==========================================================

  const searchRoles = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        const cleanQuery = query.trim();

        if (cleanQuery) {
          params.set("search", cleanQuery);
        }

        const queryString = params.toString();

        const response = await fetch(
          `/api/roles${
            queryString ? `?${queryString}` : ""
          }`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerRole[]> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to search roles",
          );
        }

        const data = result.data ?? [];

        setRoles(data);

        return data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to search roles",
        );

        setError(message);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GET CAREER GRAPH
  // ==========================================================

  const getCareerGraph = useCallback(
    async (skillSlugs: string[] = []) => {
      try {
        setLoading(true);
        setError(null);

        const cleanSlugs = Array.from(
          new Set(
            skillSlugs
              .map((slug) => slug.trim().toLowerCase())
              .filter(Boolean),
          ),
        );

        if (!cleanSlugs.length) {
          return null;
        }

        const params = new URLSearchParams();

        params.set(
          "skills",
          cleanSlugs.join(","),
        );

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerGraph> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch career graph",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch career graph",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GET COMPLETE GRAPH
  // ==========================================================

  const getCompleteGraph = useCallback(
    async (limit = 100) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          action: "all",
          limit: String(limit),
        });

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerGraph> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch complete graph",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch complete graph",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // SKILL GRAPH
  // ==========================================================

  const getSkillGraph = useCallback(
    async (limit = 50) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          action: "skills",
          limit: String(limit),
        });

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerGraph> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch skill graph",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch skill graph",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // ROLE GRAPH
  // ==========================================================

  const getRoleGraph = useCallback(
    async (limit = 50) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          action: "roles",
          limit: String(limit),
        });

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerGraph> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch role graph",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch role graph",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GRAPH BY CATEGORY
  // ==========================================================

  const getGraphByCategory = useCallback(
    async (category: string, limit = 50) => {
      try {
        setLoading(true);
        setError(null);

        const cleanCategory = category.trim();

        if (!cleanCategory) {
          return null;
        }

        const params = new URLSearchParams({
          category: cleanCategory,
          limit: String(limit),
        });

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<CareerGraph> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch category graph",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch category graph",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GRAPH BY SELECTED SKILLS
  // ==========================================================

  const getGraphBySkills = useCallback(
    async (skillSlugs: string[]) => {
      return getCareerGraph(skillSlugs);
    },
    [getCareerGraph],
  );

  // ==========================================================
  // GRAPH STATS
  // ==========================================================

  const getGraphStats = useCallback(
    async (): Promise<GraphStats | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/graph?action=stats",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result: ApiResponse<GraphStats> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch graph statistics",
          );
        }

        return result.data;
      } catch (err) {
        const message = getErrorMessage(
          err,
          "Failed to fetch graph statistics",
        );

        setError(message);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
    skills,
    roles,

    loading,
    error,

    getSkills,
    searchSkills,

    getRoles,
    searchRoles,

    getCareerGraph,
    getGraphBySkills,

    getCompleteGraph,
    getSkillGraph,
    getRoleGraph,
    getGraphByCategory,
    getGraphStats,

    clearError,
  };
}

export default useCareerGraph;