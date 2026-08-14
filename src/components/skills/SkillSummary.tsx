"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { Skill } from "../../types/skill";

interface SkillSummaryProps {
  skill?: Skill | null;
  loading?: boolean;
  error?: string | null;
  onExplore?: (skill: Skill) => void;
  onClose?: () => void;
}

export default function SkillSummary({
  skill = null,
  loading = false,
  error = null,
  onExplore,
  onClose,
}: SkillSummaryProps) {
  const router = useRouter();

  if (!skill && !loading && !error) {
    return null;
  }

  // ----------------------------------------------------------
  // SKILL LEVEL
  // ----------------------------------------------------------

  const skillLevel =
    skill?.proficiency ?? skill?.level;

  // ----------------------------------------------------------
  // RELATED ROLES
  // ----------------------------------------------------------

  const relatedRoles =
    skill?.relatedRoles ?? [];

  const relatedRoleNames =
    skill?.relatedRoleNames?.length
      ? skill.relatedRoleNames
      : relatedRoles.map((role) =>
          typeof role === "string"
            ? role
            : role.name
        );

  const relatedRoleCount =
    skill?.relatedRoleCount ??
    relatedRoles.length ??
    relatedRoleNames.length;

  // ----------------------------------------------------------
  // EXPLORE SKILL
  // ----------------------------------------------------------

  const handleExplore = () => {
    if (!skill) {
      return;
    }

    if (onExplore) {
      onExplore(skill);
      return;
    }

    const skillIdentifier =
      skill.slug || skill.id;

    router.push(
      `/explore?skill=${encodeURIComponent(
        skillIdentifier
      )}`
    );
  };

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  if (loading) {
    return (
      <article
        className="w-full"
        aria-label="Loading skill details"
        aria-busy="true"
      >
        <div className="animate-pulse space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-muted" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-40 rounded bg-muted" />

              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-md bg-muted" />
                <div className="h-6 w-24 rounded-md bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>

          <div className="h-20 rounded-lg bg-muted" />
        </div>
      </article>
    );
  }

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  if (error) {
    return (
      <article
        className="w-full"
        role="alert"
      >
        <div
          className="
            flex min-h-52
            flex-col items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              bg-destructive/10
            "
          >
            <Code2 className="h-6 w-6 text-destructive" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Unable to Load Skill
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {error}
          </p>
        </div>
      </article>
    );
  }

  if (!skill) {
    return null;
  }

  // ----------------------------------------------------------
  // SKILL
  // ----------------------------------------------------------

  return (
    <article className="w-full">
      {/* HEADER */}

      <header className="pr-2">
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-xl
              bg-primary/10
            "
          >
            <Code2 className="h-6 w-6 text-primary" />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-xl font-semibold
                tracking-tight text-foreground
                sm:text-2xl
              "
            >
              {skill.name}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">
              {skill.category && (
                <span
                  className="
                    rounded-md
                    bg-muted
                    px-2.5 py-1
                    text-xs font-medium
                    text-muted-foreground
                  "
                >
                  {skill.category}
                </span>
              )}

              {skillLevel && (
                <span
                  className="
                    rounded-md
                    border border-border
                    px-2.5 py-1
                    text-xs font-medium
                    text-muted-foreground
                  "
                >
                  {skillLevel}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* DESCRIPTION */}

      {skill.description && (
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <h3 className="text-sm font-semibold text-foreground">
              About this skill
            </h3>
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {skill.description}
          </p>
        </section>
      )}

      {/* PROFICIENCY */}

      {skillLevel && (
        <section
          className="
            mt-6
            rounded-xl
            border border-border
            bg-muted/30
            p-4
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Proficiency
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Current skill level
              </p>
            </div>

            <span className="text-sm font-semibold text-primary">
              {skillLevel}
            </span>
          </div>
        </section>
      )}

      {/* RELATED ROLES */}

      <section className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-primary" />

            <h3 className="text-sm font-semibold text-foreground">
              Related Career Roles
            </h3>
          </div>

          <span
            className="
              rounded-md
              bg-muted
              px-2 py-1
              text-xs font-medium
              text-muted-foreground
            "
          >
            {relatedRoleCount}
          </span>
        </div>

        {relatedRoleNames.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedRoleNames.map(
              (roleName, index) => (
                <span
                  key={`${roleName}-${index}`}
                  className="
                    inline-flex
                    items-center gap-1.5
                    rounded-md
                    border border-border
                    bg-background
                    px-3 py-1.5
                    text-xs font-medium
                    text-foreground
                  "
                >
                  <CheckCircle2
                    className="
                      h-3.5 w-3.5
                      shrink-0
                      text-primary
                    "
                  />

                  {roleName}
                </span>
              )
            )}
          </div>
        ) : (
          <p
            className="
              mt-3
              rounded-lg
              border border-dashed
              border-border
              px-4 py-3
              text-xs
              text-muted-foreground
            "
          >
            No related career roles available.
          </p>
        )}
      </section>

      {/* FOOTER */}

      <footer
        className="
          mt-7
          flex flex-col-reverse
          gap-3
          border-t border-border
          pt-5
          sm:flex-row
          sm:justify-end
        "
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex
              items-center justify-center
              rounded-lg
              border border-border
              bg-background
              px-4 py-2.5
              text-sm font-medium
              text-foreground
              transition-colors
              hover:bg-secondary
              focus:outline-none
              focus:ring-2
              focus:ring-ring/30
            "
          >
            Close
          </button>
        )}

        <button
          type="button"
          onClick={handleExplore}
          className="
            inline-flex
            items-center justify-center
            gap-2
            rounded-lg
            bg-primary
            px-4 py-2.5
            text-sm font-medium
            text-primary-foreground
            transition-opacity
            hover:opacity-90
            focus:outline-none
            focus:ring-2
            focus:ring-primary/30
          "
        >
          Explore Skill

          <ArrowUpRight className="h-4 w-4" />
        </button>
      </footer>
    </article>
  );
}
