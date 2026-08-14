"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  ExperienceLevel,
  Role,
  RoleDetail,
  RoleSearchQuery,
} from "../types/role";

// ============================================================
// API RESPONSE TYPES
// ============================================================

interface RolesApiResponse {
  success: boolean;
  data?: Role[] | Role | RoleDetail | null;
  count?: number;
  message?: string;
  error?: string;
}

interface RoleApiResponse {
  success: boolean;
  data?: Role | RoleDetail | null;
  message?: string;
  error?: string;
}

// ============================================================
// ROLE API EXTENDED TYPE
// ============================================================

type RoleWithSkillAliases = RoleDetail & {
  requiredSkills?: RoleDetail["skills"];
  matchedSkills?: RoleDetail["skills"];
};

// ============================================================
// HELPERS
// ============================================================

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error
    ? error.message
    : fallback;
}

// ============================================================
// NORMALIZE ROLE DETAIL
// ============================================================

function normalizeRoleDetail(
  role: Role | RoleDetail,
): RoleDetail {
  const source =
    role as RoleWithSkillAliases;

  const skills =
    Array.isArray(source.skills)
      ? source.skills
      : Array.isArray(source.requiredSkills)
        ? source.requiredSkills
        : Array.isArray(source.matchedSkills)
          ? source.matchedSkills
          : [];

  const relatedRoles =
    Array.isArray(source.relatedRoles)
      ? source.relatedRoles
      : [];

  return {
    ...role,
    skills,
    relatedRoles,
  };
}

// ============================================================
// GET ARRAY FROM API RESPONSE
// ============================================================

function normalizeRoleList(
  data:
    | Role[]
    | Role
    | RoleDetail
    | null
    | undefined,
): Role[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data) {
    return [data];
  }

  return [];
}

// ============================================================
// HOOK
// ============================================================

export default function useRoles() {
  const [roles, setRoles] =
    useState<Role[]>([]);

  const [selectedRole, setSelectedRole] =
    useState<RoleDetail | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // ==========================================================
  // GET ROLES
  // ==========================================================

  const getRoles = useCallback(
    async (
      query?: RoleSearchQuery,
    ): Promise<Role[]> => {
      try {
        setLoading(true);
        setError(null);

        const params =
          new URLSearchParams();

        if (query?.search?.trim()) {
          params.set(
            "search",
            query.search.trim(),
          );
        }

        if (query?.category?.trim()) {
          params.set(
            "category",
            query.category.trim(),
          );
        }

        if (query?.experienceLevel) {
          params.set(
            "experienceLevel",
            query.experienceLevel,
          );
        }

        if (
          query?.limit !== undefined &&
          query.limit > 0
        ) {
          params.set(
            "limit",
            String(query.limit),
          );
        }

        const queryString =
          params.toString();

        const response = await fetch(
          queryString
            ? `/api/roles?${queryString}`
            : "/api/roles",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as RolesApiResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch roles",
          );
        }

        const data =
          normalizeRoleList(
            result.data,
          );

        setRoles(data);

        return data;
      } catch (err) {
        const message =
          getErrorMessage(
            err,
            "Failed to fetch roles",
          );

        setError(message);
        setRoles([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GET ROLE BY ID
  // ==========================================================

  const getRoleById = useCallback(
    async (
      id: string,
    ): Promise<RoleDetail | null> => {
      const trimmedId =
        id.trim();

      if (!trimmedId) {
        setError(
          "Role ID is required",
        );
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `/api/roles/${encodeURIComponent(
              trimmedId,
            )}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        const result =
          (await response.json()) as RoleApiResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch role",
          );
        }

        if (!result.data) {
          setSelectedRole(null);
          return null;
        }

        const role =
          normalizeRoleDetail(
            result.data,
          );

        setSelectedRole(role);

        return role;
      } catch (err) {
        const message =
          getErrorMessage(
            err,
            "Failed to fetch role",
          );

        setError(message);
        setSelectedRole(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // GET ROLE BY SLUG
  // ==========================================================

  const getRoleBySlug = useCallback(
    async (
      slug: string,
    ): Promise<RoleDetail | null> => {
      const trimmedSlug =
        slug.trim();

      if (!trimmedSlug) {
        setError(
          "Role slug is required",
        );
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await fetch(
            `/api/roles?slug=${encodeURIComponent(
              trimmedSlug,
            )}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        const result =
          (await response.json()) as RolesApiResponse;

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch role",
          );
        }

        let role: Role | RoleDetail | null =
          null;

        if (Array.isArray(result.data)) {
          role =
            result.data[0] ?? null;
        } else {
          role =
            result.data ?? null;
        }

        if (!role) {
          setSelectedRole(null);
          return null;
        }

        const detail =
          normalizeRoleDetail(role);

        setSelectedRole(detail);

        return detail;
      } catch (err) {
        const message =
          getErrorMessage(
            err,
            "Failed to fetch role",
          );

        setError(message);
        setSelectedRole(null);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==========================================================
  // SEARCH ROLES
  // ==========================================================

  const searchRoles = useCallback(
    async (
      search: string,
    ): Promise<Role[]> => {
      return getRoles({
        search,
      });
    },
    [getRoles],
  );

  // ==========================================================
  // GET ROLES BY CATEGORY
  // ==========================================================

  const getRolesByCategory =
    useCallback(
      async (
        category: string,
      ): Promise<Role[]> => {
        const cleanCategory =
          category.trim();

        if (!cleanCategory) {
          return getRoles();
        }

        return getRoles({
          category: cleanCategory,
        });
      },
      [getRoles],
    );

  // ==========================================================
  // GET ROLES BY EXPERIENCE LEVEL
  // ==========================================================

  const getRolesByExperienceLevel =
    useCallback(
      async (
        experienceLevel: ExperienceLevel,
      ): Promise<Role[]> => {
        return getRoles({
          experienceLevel,
        });
      },
      [getRoles],
    );

  // ==========================================================
  // ADVANCED ROLE QUERY
  // ==========================================================

  const queryRoles = useCallback(
    async (
      query: RoleSearchQuery,
    ): Promise<Role[]> => {
      return getRoles(query);
    },
    [getRoles],
  );

  // ==========================================================
  // SELECT ROLE
  // ==========================================================

  const selectRole = useCallback(
    (
      role:
        | Role
        | RoleDetail
        | null,
    ) => {
      if (!role) {
        setSelectedRole(null);
        return;
      }

      const detail =
        normalizeRoleDetail(role);

      setSelectedRole(detail);
    },
    [],
  );

  // ==========================================================
  // CLEAR SELECTED ROLE
  // ==========================================================

  const clearSelectedRole =
    useCallback(() => {
      setSelectedRole(null);
    }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    void getRoles();
  }, [getRoles]);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    roles,
    selectedRole,

    loading,
    error,

    getRoles,
    getRoleById,
    getRoleBySlug,

    searchRoles,
    getRolesByCategory,
    getRolesByExperienceLevel,
    queryRoles,

    selectRole,
    clearSelectedRole,
    clearError,
  };
}
