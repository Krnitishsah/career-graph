"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import useRecommendations from "@/src/hooks/useRecommendations";

export default function RecommendationList() {
  const {
    recommendations,
    loading,
    error,
  } = useRecommendations();

  if (loading) {
    return (
      <section className="space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold text-foreground">
              Recommended Roles
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Finding the best career matches for you...
          </p>
        </div>

        {/* Loading Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-destructive/20 bg-destructive/5 p-6"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-destructive/10 p-2">
            <Sparkles className="h-5 w-5 text-destructive" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Unable to load recommendations
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return (
      <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-foreground">
          No Recommendations Yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add your skills or explore the career graph to discover suitable
          career roles.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />

            <h2 className="text-lg font-semibold text-foreground">
              Recommended Roles
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Career roles matched with your skills.
          </p>
        </div>

        <span className="shrink-0 text-sm text-muted-foreground">
          {recommendations.length}{" "}
          {recommendations.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {/* Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation) => {
          const rawScore = recommendation.matchScore ?? 0;
          const score = Math.min(Math.max(rawScore, 0), 100);

          return (
            <button
              key={recommendation.id}
              type="button"
              onClick={() => {
                // Add role navigation/details handling here.
                console.log("Selected recommendation:", recommendation);
              }}
              className="group w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              {/* Role Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                    <BriefcaseBusiness className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">
                      {recommendation.role}
                    </h3>

                    {recommendation.category && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {recommendation.category}
                      </p>
                    )}
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              {/* Match Score */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    Skill Match
                  </span>

                  <span className="font-semibold text-primary">
                    {score}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>

              {/* Skills */}
              {recommendation.skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.skills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                      {skill}
                    </span>
                  ))}

                  {recommendation.skills.length > 5 && (
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                      +{recommendation.skills.length - 5} more
                    </span>
                  )}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
