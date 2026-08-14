"use client";

import {
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import type {
  ExperienceLevel,
} from "../../types/role";

// ============================================================
// PROPS
// ============================================================

interface RoleFiltersProps {
  category: string;

  experienceLevel:
    | ExperienceLevel
    | "";

  categories: string[];

  onCategoryChange: (
    category: string,
  ) => void;

  onExperienceLevelChange: (
    level: ExperienceLevel | "",
  ) => void;

  onReset?: () => void;

  disabled?: boolean;
}

// ============================================================
// EXPERIENCE LEVELS
// ============================================================

const experienceLevels: ExperienceLevel[] = [
  "Entry",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
];

// ============================================================
// COMPONENT
// ============================================================

export default function RoleFilters({
  category,
  experienceLevel,
  categories,
  onCategoryChange,
  onExperienceLevelChange,
  onReset,
  disabled = false,
}: RoleFiltersProps) {
  const hasFilters = Boolean(
    category || experienceLevel,
  );

  return (
    <div
      className="
        rounded-xl
        border border-border
        bg-card
        p-4
        shadow-sm
      "
    >
      <div
        className="
          flex flex-col gap-4
          lg:flex-row
          lg:items-end
        "
      >
        {/* ==================================================
            HEADER
            ================================================== */}

        <div
          className="
            flex items-center gap-2
            lg:mr-2 lg:mb-2
          "
        >
          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              bg-primary/10
            "
          >
            <SlidersHorizontal
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className="
                text-sm font-semibold
                text-foreground
              "
            >
              Filters
            </p>

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Narrow down career roles
            </p>
          </div>
        </div>

        {/* ==================================================
            CATEGORY
            ================================================== */}

        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="role-category"
            className="
              mb-1.5 block
              text-xs font-medium
              text-muted-foreground
            "
          >
            Category
          </label>

          <select
            id="role-category"
            value={category}
            onChange={(event) =>
              onCategoryChange(
                event.target.value,
              )
            }
            disabled={disabled}
            className="
              h-10 w-full
              rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              transition-colors
              hover:border-input
              focus:border-primary
              focus:ring-4
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">
              All categories
            </option>

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* ==================================================
            EXPERIENCE LEVEL
            ================================================== */}

        <div className="w-full lg:max-w-xs">
          <label
            htmlFor="role-experience-level"
            className="
              mb-1.5 block
              text-xs font-medium
              text-muted-foreground
            "
          >
            Experience Level
          </label>

          <select
            id="role-experience-level"
            value={experienceLevel}
            onChange={(event) =>
              onExperienceLevelChange(
                event.target.value as
                  | ExperienceLevel
                  | "",
              )
            }
            disabled={disabled}
            className="
              h-10 w-full
              rounded-lg
              border border-border
              bg-background
              px-3
              text-sm text-foreground
              outline-none
              transition-colors
              hover:border-input
              focus:border-primary
              focus:ring-4
              focus:ring-ring/20
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <option value="">
              All levels
            </option>

            {experienceLevels.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ),
            )}
          </select>
        </div>

        {/* ==================================================
            RESET
            ================================================== */}

        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="
              inline-flex h-10
              shrink-0
              items-center
              justify-center
              gap-2
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
              focus:ring-2
              focus:ring-ring/30
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
