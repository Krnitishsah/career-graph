import SkillBadge from "./SkillBadge";
import type { SkillLevel } from "@/src/types/skill";

interface SkillCardProps {
  name: string;
  category?: string;
  level?: SkillLevel;
  description?: string;
  relatedRoles?: number | string[];
  onClick?: () => void;
}

export default function SkillCard({
  name,
  category,
  level,
  description,
  relatedRoles,
  onClick,
}: SkillCardProps) {
  const isClickable = typeof onClick === "function";

  const relatedRoleCount = Array.isArray(relatedRoles)
    ? relatedRoles.length
    : relatedRoles;

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>
  ) => {
    if (!isClickable || !onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      onClick={isClickable ? onClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={
        isClickable ? `View ${name} skill` : undefined
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
            title={name}
            className="
              truncate
              text-base font-semibold
              text-card-foreground
            "
          >
            {name}
          </h3>

          {category && (
            <p
              title={category}
              className="
                mt-1 truncate
                text-xs text-muted-foreground
              "
            >
              {category}
            </p>
          )}
        </div>

        {level && (
          <SkillBadge level={level} />
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          className="
            mt-4 line-clamp-2
            text-sm leading-6
            text-muted-foreground
          "
        >
          {description}
        </p>
      )}

      {/* Footer */}
      {relatedRoleCount !== undefined && (
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
            {relatedRoleCount}
          </span>
        </div>
      )}
    </article>
  );
}