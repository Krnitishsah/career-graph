// "use client";

// import { useEffect } from "react";
// import {
//   ArrowRight,
//   BriefcaseBusiness,
//   CheckCircle2,
//   Sparkles,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import useRecommendations from "../../hooks/useRecommendations";
// import useSkills from "../../hooks/useSkills";

// export default function RecommendationList() {
//   const router = useRouter();

//   // ==========================================================
//   // SKILLS
//   // ==========================================================

//   const {
//     skills = [],
//     loading: skillsLoading,
//     error: skillsError,
//   } = useSkills();

//   // ==========================================================
//   // RECOMMENDATIONS
//   // ==========================================================

//   const {
//     recommendations,
//     loading: recommendationsLoading,
//     error: recommendationsError,
//     getRecommendations,
//   } = useRecommendations();

//   // ==========================================================
//   // LOAD RECOMMENDATIONS
//   // ==========================================================

//   useEffect(() => {
//     if (skillsLoading) {
//       return;
//     }

//     const skillSlugs = skills
//       .map((skill) => skill.slug)
//       .filter(
//         (slug): slug is string =>
//           typeof slug === "string" &&
//           slug.trim().length > 0
//       );

//     console.log(
//       "Dashboard skill slugs:",
//       skillSlugs
//     );

//     if (!skillSlugs.length) {
//       return;
//     }

//     getRecommendations(skillSlugs);
//   }, [
//     skills,
//     skillsLoading,
//     getRecommendations,
//   ]);

//   // ==========================================================
//   // STATES
//   // ==========================================================

//   const loading =
//     skillsLoading || recommendationsLoading;

//   const error =
//     skillsError || recommendationsError;

//   // ==========================================================
//   // LOADING
//   // ==========================================================

//   if (loading) {
//     return (
//       <section className="space-y-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-primary" />

//             <h2 className="text-lg font-semibold text-foreground">
//               Recommended Roles
//             </h2>
//           </div>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Finding the best career matches for you...
//           </p>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="h-40 animate-pulse rounded-xl border border-border bg-muted/40"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   // ==========================================================
//   // ERROR
//   // ==========================================================

//   if (error) {
//     return (
//       <section
//         role="alert"
//         className="rounded-xl border border-destructive/20 bg-destructive/5 p-6"
//       >
//         <div className="flex items-start gap-3">
//           <div className="rounded-lg bg-destructive/10 p-2">
//             <Sparkles className="h-5 w-5 text-destructive" />
//           </div>

//           <div>
//             <h2 className="font-semibold text-foreground">
//               Unable to load recommendations
//             </h2>

//             <p className="mt-1 text-sm text-muted-foreground">
//               {error}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ==========================================================
//   // NO SKILLS
//   // ==========================================================

//   if (!skills.length) {
//     return (
//       <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
//         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//           <Sparkles className="h-6 w-6 text-primary" />
//         </div>

//         <h2 className="mt-4 text-lg font-semibold text-foreground">
//           Add Your Skills
//         </h2>

//         <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
//           Add skills to your profile to get personalized
//           career recommendations.
//         </p>
//       </section>
//     );
//   }

//   // ==========================================================
//   // NO RECOMMENDATIONS
//   // ==========================================================

//   if (!recommendations.length) {
//     return (
//       <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
//         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
//           <Sparkles className="h-6 w-6 text-primary" />
//         </div>

//         <h2 className="mt-4 text-lg font-semibold text-foreground">
//           No Recommendations Yet
//         </h2>

//         <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
//           We couldn't find matching career roles for your
//           current skills.
//         </p>
//       </section>
//     );
//   }

//   // ==========================================================
//   // DATA
//   // ==========================================================

//   return (
//     <section className="space-y-4">
//       {/* Header */}

//       <div className="flex items-end justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-primary" />

//             <h2 className="text-lg font-semibold text-foreground">
//               Recommended Roles
//             </h2>
//           </div>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Career roles matched with your skills.
//           </p>
//         </div>

//         <span className="shrink-0 text-sm text-muted-foreground">
//           {recommendations.length}{" "}
//           {recommendations.length === 1
//             ? "role"
//             : "roles"}
//         </span>
//       </div>

//       {/* Cards */}

//       <div className="grid gap-4 md:grid-cols-2">
//         {recommendations.map((recommendation) => {
//           const score = Math.min(
//             Math.max(
//               Number(recommendation.matchScore) || 0,
//               0
//             ),
//             100
//           );

//           return (
//             <button
//               key={recommendation.id}
//               type="button"
//               onClick={() =>
//                 router.push(
//                   `/roles/${recommendation.id}`
//                 )
//               }
//               className="group w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
//             >
//               {/* Role Header */}

//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex min-w-0 items-start gap-3">
//                   <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
//                     <BriefcaseBusiness className="h-5 w-5 text-primary" />
//                   </div>

//                   <div className="min-w-0">
//                     <h3 className="truncate font-semibold text-foreground">
//                       {recommendation.name}
//                     </h3>

//                     <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
//                       {recommendation.category && (
//                         <span>
//                           {recommendation.category}
//                         </span>
//                       )}

//                       {recommendation.level && (
//                         <>
//                           <span aria-hidden="true">
//                             •
//                           </span>

//                           <span>
//                             {recommendation.level}
//                           </span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
//               </div>

//               {/* Match Score */}

//               <div className="mt-5">
//                 <div className="flex items-center justify-between text-xs">
//                   <span className="font-medium text-muted-foreground">
//                     Skill Match
//                   </span>

//                   <span className="font-semibold text-primary">
//                     {Math.round(score)}%
//                   </span>
//                 </div>

//                 <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
//                   <div
//                     className="h-full rounded-full bg-primary transition-all duration-500"
//                     style={{
//                       width: `${score}%`,
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Matched Skills */}

//               {recommendation.matchedSkills?.length >
//                 0 && (
//                 <div className="mt-4">
//                   <p className="mb-2 text-xs font-medium text-muted-foreground">
//                     Matched Skills
//                   </p>

//                   <div className="flex flex-wrap gap-2">
//                     {recommendation.matchedSkills
//                       .slice(0, 5)
//                       .map((skill) => (
//                         <span
//                           key={skill.id}
//                           className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
//                         >
//                           <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />

//                           {skill.name}
//                         </span>
//                       ))}

//                     {recommendation.matchedSkills.length >
//                       5 && (
//                       <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
//                         +
//                         {recommendation.matchedSkills.length -
//                           5}{" "}
//                         more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Missing Skills */}

//               {recommendation.missingSkills?.length >
//                 0 && (
//                 <div className="mt-3">
//                   <p className="text-xs text-muted-foreground">
//                     {recommendation.missingSkills.length}{" "}
//                     skill
//                     {recommendation.missingSkills.length !==
//                     1
//                       ? "s"
//                       : ""}{" "}
//                     to improve this match
//                   </p>
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

import useRecommendations from "../../hooks/useRecommendations";
import useSkills from "../../hooks/useSkills";

export default function RecommendationList() {
  const router = useRouter();

  // ==========================================================
  // SKILLS
  // ==========================================================

  const {
    skills = [],
    loading: skillsLoading,
    error: skillsError,
  } = useSkills();

  // ==========================================================
  // RECOMMENDATIONS
  // ==========================================================

  const {
    recommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    getRecommendations,
  } = useRecommendations();

  // ==========================================================
  // PREVENT DUPLICATE REQUEST
  // ==========================================================

  const previousSkillsRef = useRef<string>("");

  // ==========================================================
  // LOAD RECOMMENDATIONS
  // ==========================================================

  useEffect(() => {
    if (skillsLoading) {
      return;
    }

    const skillSlugs = skills
      .map((skill) => skill.slug)
      .filter(
        (slug): slug is string =>
          typeof slug === "string" &&
          slug.trim().length > 0
      )
      .map((slug) => slug.trim().toLowerCase());

    // --------------------------------------------------------
    // NO SKILLS
    // --------------------------------------------------------

    if (!skillSlugs.length) {
      previousSkillsRef.current = "";
      return;
    }

    // --------------------------------------------------------
    // CREATE STABLE KEY
    // --------------------------------------------------------

    const skillsKey = [...skillSlugs]
      .sort()
      .join(",");

    // --------------------------------------------------------
    // AVOID DUPLICATE API REQUEST
    // --------------------------------------------------------

    if (previousSkillsRef.current === skillsKey) {
      return;
    }

    previousSkillsRef.current = skillsKey;

    console.log(
      "Dashboard skill slugs:",
      skillSlugs
    );

    // --------------------------------------------------------
    // GET RECOMMENDATIONS
    // --------------------------------------------------------

    void getRecommendations(skillSlugs);
  }, [
    skills,
    skillsLoading,
    getRecommendations,
  ]);

  // ==========================================================
  // STATES
  // ==========================================================

  const loading =
    skillsLoading || recommendationsLoading;

  const error =
    skillsError || recommendationsError;

  // ==========================================================
  // LOADING
  // ==========================================================

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

        {/* Skeleton */}

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

  // ==========================================================
  // ERROR
  // ==========================================================

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

          <div className="min-w-0">
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

  // ==========================================================
  // NO SKILLS
  // ==========================================================

  if (!skills.length) {
    return (
      <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Add Your Skills
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Add skills to your profile to get personalized
          career recommendations.
        </p>
      </section>
    );
  }

  // ==========================================================
  // NO RECOMMENDATIONS
  // ==========================================================

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
          We couldn't find matching career roles for your
          current skills.
        </p>
      </section>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  return (
    <section className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

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
          {recommendations.length === 1
            ? "role"
            : "roles"}
        </span>
      </div>

      {/* ======================================================
          RECOMMENDATION CARDS
      ====================================================== */}

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation) => {
          // ----------------------------------------------------
          // SAFE SCORE
          // ----------------------------------------------------

          const score = Math.min(
            Math.max(
              Number(recommendation.matchScore) || 0,
              0
            ),
            100
          );

          // ----------------------------------------------------
          // SAFE SKILLS
          // ----------------------------------------------------

          const matchedSkills =
            Array.isArray(
              recommendation.matchedSkills
            )
              ? recommendation.matchedSkills
              : [];

          const missingSkills =
            Array.isArray(
              recommendation.missingSkills
            )
              ? recommendation.missingSkills
              : [];

          return (
            <button
              key={recommendation.id}
              type="button"
              onClick={() => {
                router.push(
                  `/roles/${recommendation.id}`
                );
              }}
              className="group w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {/* ==================================================
                  ROLE HEADER
              ================================================== */}

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  {/* Role Icon */}

                  <div className="shrink-0 rounded-lg bg-primary/10 p-2.5">
                    <BriefcaseBusiness className="h-5 w-5 text-primary" />
                  </div>

                  {/* Role Info */}

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">
                      {recommendation.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {recommendation.category && (
                        <span>
                          {recommendation.category}
                        </span>
                      )}

                      {recommendation.level && (
                        <>
                          <span aria-hidden="true">
                            •
                          </span>

                          <span>
                            {recommendation.level}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow */}

                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>

              {/* ==================================================
                  MATCH SCORE
              ================================================== */}

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    Skill Match
                  </span>

                  <span className="font-semibold text-primary">
                    {Math.round(score)}%
                  </span>
                </div>

                {/* Progress */}

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${score}%`,
                    }}
                  />
                </div>
              </div>

              {/* ==================================================
                  MATCHED SKILLS
              ================================================== */}

              {matchedSkills.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Matched Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {matchedSkills
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />

                          <span>
                            {skill.name}
                          </span>
                        </span>
                      ))}

                    {matchedSkills.length > 5 && (
                      <span className="inline-flex items-center rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                        +
                        {matchedSkills.length - 5}{" "}
                        more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================
                  MISSING SKILLS
              ================================================== */}

              {missingSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">
                    {missingSkills.length}{" "}
                    {missingSkills.length === 1
                      ? "skill"
                      : "skills"}{" "}
                    to improve this match
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}