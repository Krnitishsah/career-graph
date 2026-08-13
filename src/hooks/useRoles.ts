"use client";

import { useCallback, useEffect, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface CareerRole {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: string;
  description?: string;
  salaryRange?: string;
}

interface RolesResponse {
  success: boolean;
  data: CareerRole[];
  count?: number;
  message?: string;
  error?: string;
}

interface RoleResponse {
  success: boolean;
  data: CareerRole | null;
  message?: string;
  error?: string;
}

// ============================================================
// HOOK
// ============================================================

export default function useRoles() {
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [selectedRole, setSelectedRole] =
    useState<CareerRole | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // GET ALL ROLES
  // ==========================================================

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/roles", {
        method: "GET",
        cache: "no-store",
      });

      const result: RolesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch roles"
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setRoles(data);

      return data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch roles";

      setError(message);
      setRoles([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // GET ROLE BY ID
  // ==========================================================

  const getRoleById = useCallback(async (id: string) => {
    if (!id.trim()) {
      setError("Role ID is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/roles?id=${encodeURIComponent(id)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: RoleResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch role"
        );
      }

      setSelectedRole(result.data);

      return result.data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch role";

      setError(message);
      setSelectedRole(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // GET ROLE BY SLUG
  // ==========================================================

  const getRoleBySlug = useCallback(async (slug: string) => {
    if (!slug.trim()) {
      setError("Role slug is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/roles?slug=${encodeURIComponent(slug)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: RoleResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            result.message ||
            "Failed to fetch role"
        );
      }

      setSelectedRole(result.data);

      return result.data;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to fetch role";

      setError(message);
      setSelectedRole(null);

      return null;
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

        const trimmedQuery = query.trim();

        if (trimmedQuery) {
          params.set("search", trimmedQuery);
        }

        const queryString = params.toString();

        const response = await fetch(
          queryString
            ? `/api/roles?${queryString}`
            : "/api/roles",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: RolesResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to search roles"
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setRoles(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to search roles";

        setError(message);
        setRoles([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // FILTER BY CATEGORY
  // ==========================================================

  const getRolesByCategory = useCallback(
    async (category: string) => {
      const trimmedCategory = category.trim();

      if (!trimmedCategory) {
        return getRoles();
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("category", trimmedCategory);

        const response = await fetch(
          `/api/roles?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: RolesResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to fetch roles by category"
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setRoles(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch roles by category";

        setError(message);
        setRoles([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [getRoles]
  );

  // ==========================================================
  // SELECT ROLE
  // ==========================================================

  const selectRole = useCallback(
    (role: CareerRole | null) => {
      setSelectedRole(role);
    },
    []
  );

  // ==========================================================
  // CLEAR SELECTED ROLE
  // ==========================================================

  const clearSelectedRole = useCallback(() => {
    setSelectedRole(null);
  }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    getRoles();
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

    selectRole,
    clearSelectedRole,

    clearError,
  };
}