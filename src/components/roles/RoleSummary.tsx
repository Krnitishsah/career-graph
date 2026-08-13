"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Layers3,
  X,
} from "lucide-react";

import type { CareerRole } from "@/src/types/role";

interface RoleSummaryProps {
  role?: CareerRole | null;
  loading?: boolean;
  error?: string | null;
  onExplore?: (role: CareerRole) => void;
  onClose?: () => void;
}

export default function RoleSummary({
  role = null,
  loading = false,
  error = null,
  onExplore,
  onClose,
}: RoleSummaryProps) {
  if (!role && !loading && !error) {
    return null;
  }

  const matchScore =
    typeof role?.matchScore === "number"
      ? Math.min(Math.max(role.matchScore, 0), 100)
      : null;

  const hasSkills =
    Array.isArray(role?.skills) && role.skills.length > 0;

  const hasRelatedSkills =
    typeof role?.relatedSkills === "number";

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-summary-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <article
        className="
          relative
          flex
          max-h-[90vh]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-2xl
        "
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =====================================================
            HEADER / CLOSE
        ====================================================== */}

        <header
          className="
            flex
            shrink-0
            items-start
            justify-between
            gap-4
            border-b
            border-border
            px-6
            py-5
            sm:px-7
          "
        >
          <div className="flex min-w-0 items-center gap-3 pr-10">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary/10
              "
            >
              <BriefcaseBusiness
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2
                id="role-summary-title"
                className="
                  truncate
                  text-lg
                  font-semibold
                  tracking-tight
                  text-foreground
                  sm:text-xl
                "
              >
                {loading
                  ? "Loading role..."
                  : error
                    ? "Career Role"
                    : role?.name}
              </h2>

              {!loading && !error && role && (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {role.category && (
                    <span
                      className="
                        rounded-md
                        bg-muted
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {role.category}
                    </span>
                  )}

                  {role.level && (
                    <span
                      className="
                        rounded-md
                        border
                        border-border
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {role.level}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TOP RIGHT CLOSE BUTTON */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close role details"
              title="Close"
              className="
                absolute
                right-4
                top-4
                inline-flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-border
                bg-background
                text-muted-foreground
                transition-colors
                hover:bg-secondary
                hover:text-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-ring/30
              "
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          )}
        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="overflow-y-auto px-6 py-6 sm:px-7">
          {/* LOADING */}

          {loading && (
            <div
              className="animate-pulse space-y-6"
              aria-label="Loading career role details"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>

              <div className="h-20 rounded-xl bg-muted" />

              <div className="h-24 rounded-xl bg-muted" />

              <div className="space-y-3">
                <div className="h-4 w-32 rounded bg-muted" />

                <div className="flex flex-wrap gap-2">
                  <div className="h-7 w-24 rounded-md bg-muted" />
                  <div className="h-7 w-28 rounded-md bg-muted" />
                  <div className="h-7 w-20 rounded-md bg-muted" />
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div
              role="alert"
              className="
                flex
                min-h-52
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-destructive/10
                "
              >
                <BriefcaseBusiness
                  className="h-6 w-6 text-destructive"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Unable to Load Career Role
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {error}
              </p>
            </div>
          )}

          {/* ROLE CONTENT */}

          {!loading && !error && role && (
            <>
              {/* DESCRIPTION */}

              {role.description && (
                <section>
                  <h3 className="text-sm font-semibold text-foreground">
                    About this role
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {role.description}
                  </p>
                </section>
              )}

              {/* SALARY */}

              {role.salaryRange && (
                <section
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-border
                    bg-muted/30
                    p-4
                  "
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    Salary Range
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {role.salaryRange}
                  </p>
                </section>
              )}

              {/* MATCH SCORE */}

              {matchScore !== null && (
                <section
                  className="
                    mt-6
                    rounded-xl
                    border
                    border-border
                    bg-muted/30
                    p-4
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Skill Match
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Based on your current skills
                      </p>
                    </div>

                    <span className="text-xl font-bold text-primary">
                      {matchScore}%
                    </span>
                  </div>

                  <div
                    className="
                      mt-3
                      h-2
                      overflow-hidden
                      rounded-full
                      bg-muted
                    "
                    role="progressbar"
                    aria-valuenow={matchScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Skill match score"
                  >
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-primary
                        transition-all
                        duration-500
                      "
                      style={{
                        width: `${matchScore}%`,
                      }}
                    />
                  </div>
                </section>
              )}

              {/* REQUIRED SKILLS */}

              {hasSkills && (
                <section className="mt-6">
                  <div className="flex items-center gap-2">
                    <Layers3
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />

                    <h3 className="text-sm font-semibold text-foreground">
                      Required Skills
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {role.skills!.map((skill) => (
                      <span
                        key={skill}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-md
                          border
                          border-border
                          bg-background
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-foreground
                        "
                      >
                        <CheckCircle2
                          className="h-3.5 w-3.5 text-primary"
                          aria-hidden="true"
                        />

                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* RELATED SKILLS */}

              {hasRelatedSkills && (
                <section
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    border-t
                    border-border
                    pt-4
                  "
                >
                  <span className="text-xs text-muted-foreground">
                    Related skills
                  </span>

                  <span
                    className="
                      rounded-md
                      bg-secondary
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-secondary-foreground
                    "
                  >
                    {role.relatedSkills}
                  </span>
                </section>
              )}
            </>
          )}
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        {!loading && (
          <footer
            className="
              flex
              shrink-0
              flex-col-reverse
              gap-3
              border-t
              border-border
              bg-card
              px-6
              py-4
              sm:flex-row
              sm:justify-end
              sm:px-7
            "
          >
            {/* CLOSE BUTTON */}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-border
                  bg-background
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-foreground
                  transition-colors
                  hover:bg-secondary
                  focus:outline-none
                  focus:ring-2
                  focus:ring-ring/30
                "
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Close
              </button>
            )}

            {/* EXPLORE */}

            {!error && role && onExplore && (
              <button
                type="button"
                onClick={() => onExplore(role)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-primary
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-primary-foreground
                  transition-opacity
                  hover:opacity-90
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/30
                "
              >
                Explore Role

                <ArrowUpRight
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            )}
          </footer>
        )}
      </article>
    </div>
  );
}