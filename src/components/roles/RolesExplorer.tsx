"use client";

import { useMemo, useState } from "react";

import RoleList from "./RoleList";
import RoleSearch from "./RoleSearch";
import RoleSummary from "./RoleSummary";

import useRoles from "@/src/hooks/useRoles";
import type { CareerRole } from "@/src/types/role";

export default function RolesExplorer() {
  const {
    roles = [],
    loading,
    error,
    selectedRole,
    selectRole,
    clearSelectedRole,
  } = useRoles();

  const [search, setSearch] = useState("");

  // ============================================================
  // FILTER ROLES
  // ============================================================

  const filteredRoles = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return roles;
    }

    return roles.filter((role) => {
      const searchableValues = [
        role.name,
        role.category,
        role.level,
        role.description,
        role.salaryRange,
        ...(role.skills ?? []),
      ];

      return searchableValues
        .filter(Boolean)
        .some((value) =>
          value!.toLowerCase().includes(query),
        );
    });
  }, [roles, search]);

  // ============================================================
  // SELECT ROLE
  // ============================================================

  const handleRoleClick = (role: CareerRole) => {
    selectRole(role);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    clearSelectedRole();
  };

  // ============================================================
  // EXPLORE ROLE
  // ============================================================

  const handleExplore = (role: CareerRole) => {
    console.log("Explore role:", role);

    // Later:
    // router.push(`/roles/${role.slug}`);
  };

  return (
    <section className="space-y-8">
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore Career Roles
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Discover career opportunities, required skills, salary
            ranges, and related career paths.
          </p>
        </div>

        {!loading && !error && (
          <div className="shrink-0 rounded-lg border border-border bg-card px-3 py-2">
            <span className="text-sm font-semibold text-foreground">
              {filteredRoles.length}
            </span>{" "}
            <span className="text-sm text-muted-foreground">
              {filteredRoles.length === 1 ? "role" : "roles"}
            </span>
          </div>
        )}
      </header>

      {/* ========================================================
          SEARCH
      ======================================================== */}

      <div className="max-w-xl">
        <RoleSearch
          value={search}
          onChange={setSearch}
          disabled={loading}
          placeholder="Search roles, skills, or categories..."
        />
      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border border-destructive/20
            bg-destructive/5
            px-4 py-3
          "
        >
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      {/* ========================================================
          ROLE LIST
      ======================================================== */}

      <section aria-labelledby="roles-list-heading">
        <div className="mb-4">
          <h2
            id="roles-list-heading"
            className="text-lg font-semibold text-foreground"
          >
            Available Career Roles
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Select a role to view its details, salary information,
            and required skills.
          </p>
        </div>

        <RoleList
          roles={filteredRoles}
          loading={loading}
          emptyMessage={
            search.trim()
              ? `No roles found for "${search}".`
              : "No career roles available."
          }
          onRoleClick={handleRoleClick}
        />
      </section>

      {/* ========================================================
          ROLE DETAILS MODAL
      ======================================================== */}

      {selectedRole && (
        <RoleSummary
          role={selectedRole}
          onExplore={handleExplore}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}