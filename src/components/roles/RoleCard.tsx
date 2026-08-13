"use client";

import type { KeyboardEvent } from "react";

import type { CareerRole, RoleLevel } from "@/src/types/role";

interface RoleCardProps {
  role?: CareerRole;
  name?: string;
  category?: string;
  level?: RoleLevel;
  description?: string;
  relatedSkills?: number;
  salaryRange?: string;
  onClick?: () => void;
}

const levelStyles: Record<RoleLevel, string> = {
  "Entry-Level":
    "bg-slate-100 text-slate-700 border-slate-200",
  "Mid-Level":
    "bg-blue-50 text-blue-700 border-blue-200",
  "Senior-Level":
    "bg-violet-50 text-violet-700 border-violet-200",
  Lead:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function RoleCard({
  role,
  name,
  category,
  level,
  description,
  relatedSkills,
  salaryRange,
  onClick,
}: RoleCardProps) {
  /*
   * Supports both:
   *
   * <RoleCard role={role} />
   *
   * and the existing:
   *
   * <RoleCard
   *   name={role.name}
   *   category={role.category}
   * />
   */

  const roleName = role?.name ?? name ?? "Untitled Role";
  const roleCategory = role?.category ?? category;
  const roleLevel = role?.level ?? level;
  const roleDescription = role?.description ?? description;
  const roleRelatedSkills =
    role?.relatedSkills ?? relatedSkills;
  const roleSalaryRange =
    role?.salaryRange ?? salaryRange;

  const isClickable = typeof onClick === "function";

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>
  ) => {
    if (!isClickable) return;

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      onClick={isClickable ? onClick : undefined}
      onKeyDown={
        isClickable ? handleKeyDown : undefined
      }
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={
        isClickable
          ? `View ${roleName} role`
          : undefined
      }
      className={`
        group flex h-full flex-col
        rounded-xl border border-border
        bg-card p-5 shadow-sm
        transition-all duration-200

        ${
          isClickable
            ? `
              cursor-pointer
              hover:-translate-y-0.5
              hover:border-primary/40
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-primary/30
            `
            : ""
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            title={roleName}
            className="
              truncate text-base
              font-semibold text-card-foreground
            "
          >
            {roleName}
          </h3>

          {roleCategory && (
            <p
              title={roleCategory}
              className="
                mt-1 truncate text-xs
                text-muted-foreground
              "
            >
              {roleCategory}
            </p>
          )}
        </div>

        {/* Level */}
        {roleLevel && (
          <span
            className={`
              inline-flex shrink-0
              items-center gap-2
              rounded-full border
              px-3 py-1.5
              text-xs font-medium
              ${levelStyles[roleLevel]}
            `}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-current"
            />

            {roleLevel}
          </span>
        )}
      </div>

      {/* Description */}
      {roleDescription && (
        <p
          className="
            mt-4 line-clamp-3
            text-sm leading-6
            text-muted-foreground
          "
        >
          {roleDescription}
        </p>
      )}

      {/* Salary */}
      {roleSalaryRange && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Salary range
          </p>

          <p className="mt-1 text-sm font-medium text-card-foreground">
            {roleSalaryRange}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-5">
        {roleRelatedSkills !== undefined && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Related skills
            </span>

            <span
              className="
                rounded-md bg-secondary
                px-2 py-1
                text-xs font-medium
                text-secondary-foreground
              "
            >
              {roleRelatedSkills}
            </span>
          </div>
        )}

        {/* Click hint */}
        {isClickable && (
          <div
            className={`
              flex items-center justify-end
              ${
                roleRelatedSkills !== undefined
                  ? "mt-3"
                  : ""
              }
            `}
          >
            <span
              className="
                text-xs font-medium
                text-primary opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            >
              View role
            </span>
          </div>
        )}
      </div>
    </article>
  );
}