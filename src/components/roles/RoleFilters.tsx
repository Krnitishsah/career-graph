"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";

import type { RoleLevel } from "@/src/types/role";

interface RoleFiltersProps {
  category: string;
  level: RoleLevel | "";
  categories: string[];
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: RoleLevel | "") => void;
  onReset?: () => void;
  disabled?: boolean;
}

const levels: RoleLevel[] = [
  "Entry-Level",
  "Mid-Level",
  "Senior-Level",
  "Lead",
];

export default function RoleFilters({
  category,
  level,
  categories,
  onCategoryChange,
  onLevelChange,
  onReset,
  disabled = false,
}: RoleFiltersProps) {
  const hasFilters = Boolean(category || level);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Header */}
        <div className="flex items-center gap-2 lg:mr-2 lg:mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              Filters
            </p>

            <p className="text-xs text-muted-foreground">
              Narrow down career roles
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="role-category"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Category
          </label>

          <select
            id="role-category"
            value={category}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
            disabled={disabled}
            className="
              h-10 w-full rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              transition-colors
              hover:border-input
              focus:border-primary
              focus:ring-4 focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="role-level"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Experience Level
          </label>

          <select
            id="role-level"
            value={level}
            onChange={(event) =>
              onLevelChange(
                event.target.value as RoleLevel | ""
              )
            }
            disabled={disabled}
            className="
              h-10 w-full rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              transition-colors
              hover:border-input
              focus:border-primary
              focus:ring-4 focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">All levels</option>

            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="
              inline-flex h-10 shrink-0
              items-center justify-center gap-2
              rounded-lg
              border border-border
              bg-background
              px-3
              text-sm font-medium
              text-muted-foreground
              transition-colors
              hover:bg-secondary
              hover:text-foreground
              focus:outline-none
              focus:ring-2 focus:ring-ring/30
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <RotateCcw
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            Reset
          </button>
        )}
      </div>
    </div>
  );
}