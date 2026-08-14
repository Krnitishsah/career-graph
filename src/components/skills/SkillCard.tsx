import type { KeyboardEvent } from "react";

import SkillBadge from "./SkillBadge";
import type { Skill } from "../../types/skill";

interface SkillCardProps {
  skill: Skill;
  onClick?: (skill: Skill) => void;
}

export default function SkillCard({
  skill,
  onClick,
}: SkillCardProps) {
  const isClickable = typeof onClick === "function";

  const relatedRoleNames = Array.isArray(
    skill.relatedRoleNames,
  )
    ? skill.relatedRoleNames
    : Array.isArray(skill.relatedRoles)
      ? skill.relatedRoles
      : [];

  const roleCount =
    typeof skill.relatedRoleCount === "number"
      ? skill.relatedRoleCount
      : relatedRoleNames.length;

  const skillLevel =
    skill.proficiency ?? skill.level;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
  ) => {
    if (!isClickable || !onClick) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onClick(skill);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  return (
    <article
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={
        isClickable ? handleKeyDown : undefined
      }
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={
        isClickable
          ? `View ${skill.name} skill`
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
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            title={skill.name}
            className="
              truncate
              text-base font-semibold
              text-card-foreground
            "
          >
            {skill.name}
          </h3>

          {skill.category && (
            <p
              title={skill.category}
              className="
                mt-1 truncate
                text-xs text-muted-foreground
              "
            >
              {skill.category}
            </p>
          )}
        </div>

        {skillLevel && (
          <SkillBadge level={skillLevel} />
        )}
      </div>

      {/* DESCRIPTION */}
      {skill.description && (
        <p
          className="
            mt-4 line-clamp-2
            text-sm leading-6
            text-muted-foreground
          "
        >
          {skill.description}
        </p>
      )}

      {/* FOOTER */}
      <div
        className="
          mt-auto flex items-center
          justify-between
          border-t border-border
          pt-4
        "
      >
        <span className="text-xs text-muted-foreground">
          Related roles
        </span>

        <span
          className="
            rounded-md
            bg-secondary
            px-2 py-1
            text-xs font-medium
            text-secondary-foreground
          "
        >
          {roleCount}
        </span>
      </div>
    </article>
  );
}