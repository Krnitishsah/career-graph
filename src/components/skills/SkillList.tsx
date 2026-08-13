import SkillCard from "./SkillCard";
import type { Skill } from "@/src/types/skill";

interface SkillListProps {
  skills?: Skill[];
  onSkillClick?: (skill: Skill) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export default function SkillList({
  skills = [],
  onSkillClick,
  emptyMessage = "No skills found.",
  loading = false,
}: SkillListProps) {
  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className="
          grid grid-cols-1 gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
        aria-label="Loading skills"
        aria-busy="true"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skill-skeleton-${index}`}
            className="
              h-52 animate-pulse
              rounded-xl
              border border-border
              bg-card
            "
          />
        ))}
      </div>
    );
  }

  // ============================================================
  // EMPTY
  // ============================================================

  if (!skills.length) {
    return (
      <div
        className="
          flex min-h-40
          items-center justify-center
          rounded-xl
          border border-dashed
          border-border
          bg-card
          px-6
        "
      >
        <div className="text-center">
          <h3 className="text-sm font-semibold text-card-foreground">
            {emptyMessage}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try searching for another skill or category.
          </p>
        </div>
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
      {skills.map((skill, index) => (
        <SkillCard
          key={skill.id || `${skill.slug}-${index}`}
          name={skill.name}
          category={skill.category}
          level={skill.level}
          description={skill.description ?? undefined}
          relatedRoles={skill.relatedRoles}
          onClick={
            onSkillClick
              ? () => onSkillClick(skill)
              : undefined
          }
        />
      ))}
    </div>
  );
}