"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Layers3,
  X,
} from "lucide-react";

import type { RoleDetail } from "../../types/role";

interface RoleSummaryProps {
  role?: RoleDetail | null;
  loading?: boolean;
  error?: string | null;
  onExplore?: (role: RoleDetail) => void;
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

  const skills = Array.isArray(role?.skills)
    ? role.skills
    : [];

  const relatedRoles = Array.isArray(
    role?.relatedRoles,
  )
    ? role.relatedRoles
    : [];

  const skillCount = skills.length;

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
          relative flex
          max-h-[90vh]
          w-full max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border border-border
          bg-card
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header
          className="
            flex shrink-0
            items-start justify-between
            gap-4
            border-b border-border
            px-6 py-5
            sm:px-7
          "
        >
          <div className="flex min-w-0 items-center gap-3 pr-10">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
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
                  text-lg font-semibold
                  tracking-tight
                  text-foreground
                  sm:text-xl
                "
              >
                {loading
                  ? "Loading role..."
                  : error
                    ? "Career Role"
                    : role?.name ?? "Career Role"}
              </h2>

              {!loading && !error && role && (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {role.category && (
                    <span
                      className="
                        rounded-md
                        bg-muted
                        px-2.5 py-1
                        text-xs font-medium
                        text-muted-foreground
                      "
                    >
                      {role.category}
                    </span>
                  )}

                  {role.experienceLevel && (
                    <span
                      className="
                        rounded-md
                        border border-border
                        px-2.5 py-1
                        text-xs font-medium
                        text-muted-foreground
                      "
                    >
                      {role.experienceLevel}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CLOSE */}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close role details"
              title="Close"
              className="
                absolute right-4 top-4
                inline-flex h-9 w-9
                items-center justify-center
                rounded-lg
                border border-border
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
              aria-busy="true"
            >
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-5/6 rounded bg-muted" />
              </div>

              <div className="h-20 rounded-xl bg-muted" />

              <div className="h-20 rounded-xl bg-muted" />

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
                flex min-h-52
                flex-col
                items-center
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
                <BriefcaseBusiness
                  className="h-6 w-6 text-destructive"
                  aria-hidden="true"
                />
              </div>

              <h3
                className="
                  mt-4
                  text-lg font-semibold
                  text-foreground
                "
              >
                Unable to Load Career Role
              </h3>

              <p
                className="
                  mt-2 max-w-md
                  text-sm leading-6
                  text-muted-foreground
                "
              >
                {error}
              </p>
            </div>
          )}

          {/* ROLE */}

          {!loading && !error && role && (
            <>
              {/* DESCRIPTION */}

              {role.description && (
                <section>
                  <h3
                    className="
                      text-sm font-semibold
                      text-foreground
                    "
                  >
                    About this role
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm leading-6
                      text-muted-foreground
                    "
                  >
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
                    border border-border
                    bg-muted/30
                    p-4
                  "
                >
                  <p
                    className="
                      text-xs font-medium
                      text-muted-foreground
                    "
                  >
                    Salary Range
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm font-semibold
                      text-foreground
                    "
                  >
                    {role.salaryRange}
                  </p>
                </section>
              )}

              {/* REQUIRED SKILLS COUNT */}

              <section
                className="
                  mt-6
                  flex items-center
                  justify-between
                  rounded-xl
                  border border-border
                  bg-muted/30
                  p-4
                "
              >
                <div className="flex items-center gap-2">
                  <Layers3
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />

                  <span
                    className="
                      text-sm font-medium
                      text-foreground
                    "
                  >
                    Required Skills
                  </span>
                </div>

                <span
                  className="
                    rounded-md
                    bg-secondary
                    px-2.5 py-1
                    text-xs font-semibold
                    text-secondary-foreground
                  "
                >
                  {skillCount}
                </span>
              </section>

              {/* REQUIRED SKILLS */}

              {skills.length > 0 && (
                <section className="mt-6">
                  <div className="flex items-center gap-2">
                    <Layers3
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />

                    <h3
                      className="
                        text-sm font-semibold
                        text-foreground
                      "
                    >
                      Required Skills
                    </h3>
                  </div>

                  <div
                    className="
                      mt-3
                      grid grid-cols-1
                      gap-2
                      sm:grid-cols-2
                    "
                  >
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="
                          flex items-start
                          gap-2.5
                          rounded-lg
                          border border-border
                          bg-background
                          px-3 py-2.5
                        "
                      >
                        <CheckCircle2
                          className="
                            mt-0.5
                            h-4 w-4
                            shrink-0
                            text-primary
                          "
                          aria-hidden="true"
                        />

                        <div className="min-w-0">
                          <p
                            className="
                              truncate
                              text-xs font-medium
                              text-foreground
                            "
                          >
                            {skill.name}
                          </p>

                          {skill.category && (
                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-muted-foreground
                              "
                            >
                              {skill.category}
                            </p>
                          )}

                          {skill.required !== undefined && (
                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-muted-foreground
                              "
                            >
                              {skill.required
                                ? "Required"
                                : "Recommended"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* NO SKILLS */}

              {skills.length === 0 && (
                <section
                  className="
                    mt-6
                    rounded-xl
                    border border-dashed
                    border-border
                    p-4
                  "
                >
                  <p
                    className="
                      text-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No required skills found for this role.
                  </p>
                </section>
              )}

              {/* RELATED ROLES */}

              {relatedRoles.length > 0 && (
                <section className="mt-6">
                  <h3
                    className="
                      text-sm font-semibold
                      text-foreground
                    "
                  >
                    Related Career Paths
                  </h3>

                  <div className="mt-3 space-y-2">
                    {relatedRoles
                      .slice(0, 5)
                      .map((relatedRole) => (
                        <div
                          key={relatedRole.id}
                          className="
                            flex items-center
                            justify-between
                            gap-3
                            rounded-lg
                            border border-border
                            bg-background
                            px-3 py-2.5
                          "
                        >
                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-xs font-medium
                                text-foreground
                              "
                            >
                              {relatedRole.name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-muted-foreground
                              "
                            >
                              {relatedRole.category}
                            </p>
                          </div>

                          {relatedRole.experienceLevel && (
                            <span
                              className="
                                shrink-0
                                rounded-md
                                bg-secondary
                                px-2 py-1
                                text-[11px]
                                text-secondary-foreground
                              "
                            >
                              {relatedRole.experienceLevel}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
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
              flex shrink-0
              flex-col-reverse
              gap-3
              border-t border-border
              bg-card
              px-6 py-4
              sm:flex-row
              sm:justify-end
              sm:px-7
            "
          >
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
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Close
              </button>
            )}

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
