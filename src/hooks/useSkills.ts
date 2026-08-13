"use client";

import { useCallback, useEffect, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;

  // UI fields
  level?: SkillLevel;
  proficiency?: SkillLevel;
  relatedRoles?: number | string[];
}

interface SkillsResponse {
  success: boolean;
  data: Skill[];
  count?: number;
  message?: string;
  error?: string;
}

interface SkillResponse {
  success: boolean;
  data: Skill | null;
  message?: string;
  error?: string;
}

// ============================================================
// HOOK
// ============================================================

export default function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // GET ALL SKILLS
  // ============================================================

  const getSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/skills", {
        method: "GET",
        cache: "no-store",
      });

      const result: SkillsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch skills"
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setSkills(data);

      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch skills";

      setError(message);
      setSkills([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  // ============================================================
  // GET SKILL BY ID
  // ============================================================

  const getSkillById = useCallback(async (id: string) => {
    if (!id) {
      setError("Skill ID is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/skills?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: SkillResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch skill"
        );
      }

      setSelectedSkill(result.data);

      return result.data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch skill";

      setError(message);
      setSelectedSkill(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // GET SKILL BY SLUG
  // ============================================================

  const getSkillBySlug = useCallback(async (slug: string) => {
    if (!slug) {
      setError("Skill slug is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/skills?slug=${encodeURIComponent(slug)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: SkillResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch skill"
        );
      }

      setSelectedSkill(result.data);

      return result.data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch skill";

      setError(message);
      setSelectedSkill(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // SEARCH SKILLS
  // ============================================================

  const searchSkills = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("search", query.trim());
      }

      const response = await fetch(
        `/api/skills?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: SkillsResponse =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to search skills"
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setSkills(data);

      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to search skills";

      setError(message);
      setSkills([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // GET SKILLS BY CATEGORY
  // ============================================================

  const getSkillsByCategory = useCallback(
    async (category: string) => {
      if (!category.trim()) {
        return getSkills();
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("category", category.trim());

        const response = await fetch(
          `/api/skills?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: SkillsResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch skills by category"
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setSkills(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch skills by category";

        setError(message);
        setSkills([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [getSkills]
  );

  // ============================================================
  // SELECT
  // ============================================================

  const selectSkill = useCallback(
    (skill: Skill | null) => {
      setSelectedSkill(skill);
    },
    []
  );

  // ============================================================
  // TOGGLE
  // ============================================================

  const toggleSkill = useCallback((skill: Skill) => {
    setSkills((currentSkills) => {
      const exists = currentSkills.some(
        (item) => item.id === skill.id
      );

      if (exists) {
        return currentSkills.filter(
          (item) => item.id !== skill.id
        );
      }

      return [...currentSkills, skill];
    });
  }, []);

  // ============================================================
  // CLEAR
  // ============================================================

  const clearSelectedSkill = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    skills,
    selectedSkill,

    loading,
    error,

    getSkills,
    getSkillById,
    getSkillBySlug,
    searchSkills,
    getSkillsByCategory,

    selectSkill,
    toggleSkill,
    clearSelectedSkill,
    clearError,
  };
}