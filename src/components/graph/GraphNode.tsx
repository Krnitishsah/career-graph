"use client";

import {
  BriefcaseBusiness,
  Code2,
  Database,
  Server,
  Sparkles,
} from "lucide-react";

import type {
  CareerRole,
  CareerSkill,
} from "@/src/hooks/useCareerGraph";

type GraphNodeData = CareerSkill | CareerRole;

interface GraphNodeProps {
  node: GraphNodeData;
  type: "skill" | "role";
  selected?: boolean;
  onClick?: () => void;
}

// ============================================================
// CATEGORY ICONS
// ============================================================

const categoryIcons: Record<string, typeof Code2> = {
  Frontend: Code2,
  Backend: Server,
  Database,
  "State Management": Code2,
  Mobile: Code2,
  DevOps: Server,
  Cloud: Server,
  Tools: Code2,
  Testing: Code2,
  "AI/ML": Sparkles,
};

// ============================================================
// COMPONENT
// ============================================================

export default function GraphNode({
  node,
  type,
  selected = false,
  onClick,
}: GraphNodeProps) {
  const isSkill = type === "skill";

  const role = !isSkill ? (node as CareerRole) : null;

  const Icon = isSkill
    ? categoryIcons[node.category] ?? Code2
    : BriefcaseBusiness;

  // ============================================================
  // KEYBOARD HANDLER
  // ============================================================

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${type}: ${node.name}`}
      aria-pressed={selected}
      className={`
        group
        relative
        flex
        min-h-24
        w-full
        flex-col
        justify-between
        rounded-xl
        border
        bg-card
        p-4
        text-left
        shadow-sm
        transition-all
        duration-200

        ${
          selected
            ? `
              border-primary
              bg-primary/5
              ring-2
              ring-primary/20
            `
            : `
              border-border
            `
        }

        ${
          onClick
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
      {/* ========================================================
          NODE HEADER
      ======================================================== */}

      <div className="flex items-start gap-3">
        {/* Icon */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg

            ${
              isSkill
                ? `
                  bg-primary/10
                  text-primary
                `
                : `
                  bg-secondary
                  text-secondary-foreground
                `
            }
          `}
        >
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </div>

        {/* Name + Category */}

        <div className="min-w-0 flex-1">
          <h3
            title={node.name}
            className="
              truncate
              text-sm
              font-semibold
              text-foreground
            "
          >
            {node.name}
          </h3>

          {node.category && (
            <p
              title={node.category}
              className="
                mt-1
                truncate
                text-xs
                text-muted-foreground
              "
            >
              {node.category}
            </p>
          )}
        </div>
      </div>

      {/* ========================================================
          NODE META
      ======================================================== */}

      <div className="mt-4 flex min-h-5 items-center justify-between gap-2">
        {/* Node Type */}

        <span
          className="
            rounded-md
            bg-muted
            px-2
            py-1
            text-[11px]
            font-medium
            text-muted-foreground
          "
        >
          {isSkill ? "Skill" : "Career Role"}
        </span>

        {/* Role Level */}

        {role?.level && (
          <span
            className="
              truncate
              text-xs
              font-medium
              text-primary
            "
            title={role.level}
          >
            {role.level}
          </span>
        )}

        {/* Match Score */}

        {role?.matchScore !== undefined && (
          <span
            className="
              whitespace-nowrap
              text-xs
              font-semibold
              text-primary
            "
          >
            {Math.round(role.matchScore)}% match
          </span>
        )}
      </div>

      {/* ========================================================
          SELECTED INDICATOR
      ======================================================== */}

      {selected && (
        <span
          className="
            absolute
            right-3
            top-3
            h-2
            w-2
            rounded-full
            bg-primary
          "
          aria-hidden="true"
        />
      )}
    </button>
  );
}