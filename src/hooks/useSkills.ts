"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  Skill,
  SkillLevel,
} from "../types/skill";

// ============================================================
// API SKILL
// ============================================================

interface ApiSkill {
  id: string;
  name: string;
  slug: string;
  category: string;

  description?: string | null;

  level?: SkillLevel | null;

  proficiency?: SkillLevel | string | null;

  /**
   * Backend returns role names here.
   */
  relatedRoles?: string[] | null;

  /**
   * Compatibility field.
   */
  relatedRoleNames?: string[] | null;

  /**
   * Number of connected roles.
   */
  relatedRoleCount?: number | null;
}

// ============================================================
// API RESPONSES
// ============================================================

interface SkillsResponse {
  success: boolean;
  data: ApiSkill[];
  count?: number;
  message?: string;
  error?: string;
}

interface SkillResponse {
  success: boolean;
  data: ApiSkill | null;
  message?: string;
  error?: string;
}

// ============================================================
// NORMALIZE ROLE NAMES
// ============================================================

function normalizeRoleNames(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (role): role is string =>
        typeof role === "string" &&
        role.trim().length > 0
    )
    .map((role) => role.trim());
}

// ============================================================
// NORMALIZE SKILL
// ============================================================

function normalizeSkill(
  skill: ApiSkill
): Skill {
  const relatedRoles =
    normalizeRoleNames(
      skill.relatedRoles
    );

  const relatedRoleNames =
    normalizeRoleNames(
      skill.relatedRoleNames
    );

  /**
   * Prefer relatedRoleNames when available.
   * Otherwise use relatedRoles.
   */
  const finalRoleNames =
    relatedRoleNames.length > 0
      ? relatedRoleNames
      : relatedRoles;

  /**
   * Backend already calculates the count.
   * Fallback to array length for compatibility.
   */
  const relatedRoleCount =
    typeof skill.relatedRoleCount ===
      "number" &&
    Number.isFinite(
      skill.relatedRoleCount
    )
      ? skill.relatedRoleCount
      : finalRoleNames.length;

  return {
    id: skill.id,
    name: skill.name,
    slug: skill.slug,
    category: skill.category,

    description:
      skill.description ??
      undefined,

    level:
      skill.level ??
      undefined,

    proficiency:
      skill.proficiency ??
      undefined,

    relatedRoles:
      finalRoleNames,

    relatedRoleNames:
      finalRoleNames,

    relatedRoleCount,
  };
}

// ============================================================
// NORMALIZE SKILLS
// ============================================================

function normalizeSkills(
  skills: ApiSkill[]
): Skill[] {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills.map(
    normalizeSkill
  );
}

// ============================================================
// HOOK
// ============================================================

export default function useSkills() {
  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [
    selectedSkill,
    setSelectedSkill,
  ] = useState<Skill | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // GET ALL SKILLS
  // ==========================================================

  const getSkills =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            "/api/skills",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        const result: SkillsResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch skills"
          );
        }

        const data =
          normalizeSkills(
            result.data
          );

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

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  // ==========================================================
  // GET SKILL BY ID
  // ==========================================================

  const getSkillById =
    useCallback(
      async (id: string) => {
        const skillId =
          id?.trim();

        if (!skillId) {
          setError(
            "Skill ID is required"
          );

          return null;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await fetch(
              `/api/skills?id=${encodeURIComponent(
                skillId
              )}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          const result: SkillResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                result.message ||
                "Failed to fetch skill"
            );
          }

          const data =
            result.data
              ? normalizeSkill(
                  result.data
                )
              : null;

          setSelectedSkill(data);

          return data;
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
      },
      []
    );

  // ==========================================================
  // GET SKILL BY SLUG
  // ==========================================================

  const getSkillBySlug =
    useCallback(
      async (slug: string) => {
        const skillSlug =
          slug?.trim();

        if (!skillSlug) {
          setError(
            "Skill slug is required"
          );

          return null;
        }

        try {
          setLoading(true);
          setError(null);

          const response =
            await fetch(
              `/api/skills?slug=${encodeURIComponent(
                skillSlug
              )}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          const result: SkillResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                result.message ||
                "Failed to fetch skill"
            );
          }

          const data =
            result.data
              ? normalizeSkill(
                  result.data
                )
              : null;

          setSelectedSkill(data);

          return data;
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
      },
      []
    );

  // ==========================================================
  // SEARCH SKILLS
  // ==========================================================

  const searchSkills =
    useCallback(
      async (query: string) => {
        try {
          setLoading(true);
          setError(null);

          const value =
            query?.trim() ?? "";

          const params =
            new URLSearchParams();

          if (value) {
            params.set(
              "search",
              value
            );
          }

          const queryString =
            params.toString();

          const url =
            queryString
              ? `/api/skills?${queryString}`
              : "/api/skills";

          const response =
            await fetch(url, {
              method: "GET",
              cache: "no-store",
            });

          const result: SkillsResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                result.message ||
                "Failed to search skills"
            );
          }

          const data =
            normalizeSkills(
              result.data
            );

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
      },
      []
    );

  // ==========================================================
  // GET SKILLS BY CATEGORY
  // ==========================================================

  const getSkillsByCategory =
    useCallback(
      async (
        category: string
      ) => {
        const value =
          category?.trim() ?? "";

        if (!value) {
          return getSkills();
        }

        try {
          setLoading(true);
          setError(null);

          const params =
            new URLSearchParams();

          params.set(
            "category",
            value
          );

          const response =
            await fetch(
              `/api/skills?${params.toString()}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          const result: SkillsResponse =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.error ||
                result.message ||
                "Failed to fetch skills by category"
            );
          }

          const data =
            normalizeSkills(
              result.data
            );

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

  // ==========================================================
  // SELECT SKILL
  // ==========================================================

  const selectSkill =
    useCallback(
      (skill: Skill | null) => {
        setSelectedSkill(skill);
      },
      []
    );

  // ==========================================================
  // TOGGLE SKILL
  // ==========================================================

  const toggleSkill =
    useCallback(
      (skill: Skill) => {
        setSkills(
          (currentSkills) => {
            const exists =
              currentSkills.some(
                (item) =>
                  item.id ===
                  skill.id
              );

            if (exists) {
              return currentSkills.filter(
                (item) =>
                  item.id !==
                  skill.id
              );
            }

            return [
              ...currentSkills,
              skill,
            ];
          }
        );
      },
      []
    );

  // ==========================================================
  // CLEAR SELECTED
  // ==========================================================

  const clearSelectedSkill =
    useCallback(() => {
      setSelectedSkill(null);
    }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  // ==========================================================
  // RETURN
  // ==========================================================

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
