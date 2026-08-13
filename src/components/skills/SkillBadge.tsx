import type { SkillLevel } from "@/src/types/skill";

interface SkillBadgeProps {
  level?: SkillLevel;
  className?: string;
}

const levelStyles: Record<SkillLevel, string> = {
  Beginner: "border-slate-200 bg-slate-100 text-slate-700",

  Intermediate: "border-blue-200 bg-blue-50 text-blue-700",

  Advanced: "border-violet-200 bg-violet-50 text-violet-700",

  Expert: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function SkillBadge({
  level,
  className = "",
}: SkillBadgeProps) {
  if (!level) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex shrink-0
        items-center gap-2
        rounded-full border
        px-3 py-1.5
        text-xs font-medium
        transition-colors
        ${levelStyles[level]}
        ${className}
      `}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />

      <span>{level}</span>
    </span>
  );
}