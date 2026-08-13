import RoleCard from "./RoleCard";
import type { CareerRole } from "@/src/types/role";

interface RoleListProps {
  roles?: CareerRole[];
  onRoleClick?: (role: CareerRole) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export default function RoleList({
  roles = [],
  onRoleClick,
  emptyMessage = "No roles found.",
  loading = false,
}: RoleListProps) {
  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Loading roles"
        aria-busy="true"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              h-52 animate-pulse rounded-xl
              border border-border bg-card
            "
          />
        ))}
      </div>
    );
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (roles.length === 0) {
    return (
      <div
        className="
          flex min-h-40 items-center justify-center
          rounded-xl border border-dashed
          border-border bg-card px-6
        "
      >
        <p className="text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // ============================================================
  // LIST
  // ============================================================

  return (
    <div
      className="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {roles.map((role, index) => (
        <RoleCard
          key={role.id || `${role.slug}-${index}`}
          name={role.name}
          category={role.category}
          level={role.level}
          description={role.description}
          relatedSkills={role.relatedSkills}
          salaryRange={role.salaryRange}
          onClick={
            onRoleClick
              ? () => onRoleClick(role)
              : undefined
          }
        />
      ))}
    </div>
  );
}