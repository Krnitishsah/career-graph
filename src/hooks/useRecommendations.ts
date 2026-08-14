// "use client";

// import { useCallback, useState } from "react";

// // ============================================================
// // TYPES
// // ============================================================

// export interface RecommendationSkill {
//   id: string;
//   name: string;
//   slug: string;
//   category: string;
//   description?: string;
// }

// export interface CareerRecommendation {
//   id: string;
//   name: string;
//   slug: string;
//   category: string;
//   level?: string;
//   description?: string;
//   salaryRange?: string;

//   matchScore: number;

//   matchedSkills: RecommendationSkill[];
//   missingSkills: RecommendationSkill[];
// }

// interface RecommendationResponse {
//   success: boolean;
//   data?: CareerRecommendation[];
//   count?: number;
//   message?: string;
//   error?: string;
// }

// // ============================================================
// // HOOK
// // ============================================================

// export default function useRecommendations() {
//   const [recommendations, setRecommendations] = useState<
//     CareerRecommendation[]
//   >([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // ==========================================================
//   // GET RECOMMENDATIONS
//   // ==========================================================

//   const getRecommendations = useCallback(
//     async (skillSlugs: string[]) => {
//       const validSkillSlugs = skillSlugs
//         .map((slug) => slug.trim())
//         .filter(Boolean);

//       if (!validSkillSlugs.length) {
//         setRecommendations([]);
//         setError(null);

//         return [];
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const params = new URLSearchParams();

//         params.set(
//           "skills",
//           validSkillSlugs.join(",")
//         );

//         const url = `/api/graph?${params.toString()}`;

//         console.log(
//           "Fetching recommendations:",
//           url
//         );

//         const response = await fetch(url, {
//           method: "GET",
//           cache: "no-store",
//         });

//         const result =
//           (await response.json()) as RecommendationResponse;

//         console.log(
//           "Recommendation API response:",
//           result
//         );

//         if (!response.ok || !result.success) {
//           throw new Error(
//             result.error ||
//               result.message ||
//               "Failed to get career recommendations"
//           );
//         }

//         const data = Array.isArray(result.data)
//           ? result.data
//           : [];

//         setRecommendations(data);

//         return data;
//       } catch (error) {
//         const message =
//           error instanceof Error
//             ? error.message
//             : "Failed to get career recommendations";

//         console.error(
//           "Recommendation API error:",
//           error
//         );

//         setError(message);
//         setRecommendations([]);

//         return [];
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // ==========================================================
//   // REFRESH
//   // ==========================================================

//   const refreshRecommendations = useCallback(
//     async (skillSlugs: string[]) => {
//       return getRecommendations(skillSlugs);
//     },
//     [getRecommendations]
//   );

//   // ==========================================================
//   // CLEAR
//   // ==========================================================

//   const clearRecommendations = useCallback(() => {
//     setRecommendations([]);
//     setError(null);
//   }, []);

//   // ==========================================================
//   // CLEAR ERROR
//   // ==========================================================

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // ==========================================================
//   // RETURN
//   // ==========================================================

//   return {
//     recommendations,
//     loading,
//     error,

//     getRecommendations,
//     refreshRecommendations,

//     clearRecommendations,
//     clearError,
//   };
// }







"use client";

import { useCallback, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface RecommendationSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

export interface CareerRecommendation {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: string;
  description?: string;
  salaryRange?: string;

  matchScore: number;

  matchedSkills: RecommendationSkill[];
  missingSkills: RecommendationSkill[];
}

interface GraphSkill {
  id: string;
  label: string;
  properties?: {
    name?: string;
    slug?: string;
    category?: string;
    description?: string;
  };
}

interface GraphRole {
  role: {
    id: string;
    label: string;
    properties?: {
      name?: string;
      slug?: string;
      category?: string;
      level?: string;
      experienceLevel?: string;
      description?: string;
      salaryRange?: string;
    };
  };

  matchCount: number;

  matchedSkills: GraphSkill[];
}

interface RecommendationResponse {
  success: boolean;
  message?: string;

  count?: number;

  roles?: GraphRole[];

  selectedSkills?: string[];

  data?: {
    nodes?: GraphSkill[];
    relationships?: unknown[];
  };

  error?: string;
}

// ============================================================
// HOOK
// ============================================================

export default function useRecommendations() {
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // GET RECOMMENDATIONS
  // ==========================================================

  const getRecommendations = useCallback(
    async (skillSlugs: string[]) => {
      // ------------------------------------------------------
      // CLEAN SKILL SLUGS
      // ------------------------------------------------------

      const validSkillSlugs = skillSlugs
        .map((slug) => slug.trim().toLowerCase())
        .filter(Boolean);

      // ------------------------------------------------------
      // NO SKILLS
      // ------------------------------------------------------

      if (!validSkillSlugs.length) {
        setRecommendations([]);
        setError(null);

        return [];
      }

      try {
        setLoading(true);
        setError(null);

        // ----------------------------------------------------
        // QUERY PARAMS
        // ----------------------------------------------------

        const params = new URLSearchParams();

        params.set(
          "skills",
          validSkillSlugs.join(",")
        );

        // ----------------------------------------------------
        // API REQUEST
        // ----------------------------------------------------

        const response = await fetch(
          `/api/graph?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result =
          (await response.json()) as RecommendationResponse;

        // ----------------------------------------------------
        // API ERROR
        // ----------------------------------------------------

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              result.message ||
              "Failed to get career recommendations"
          );
        }

        // ----------------------------------------------------
        // API ROLES
        // ----------------------------------------------------

        const roles = Array.isArray(result.roles)
          ? result.roles
          : [];

        // ----------------------------------------------------
        // GRAPH NODES
        // ----------------------------------------------------

        const graphNodes = Array.isArray(
          result.data?.nodes
        )
          ? result.data.nodes
          : [];

        // ----------------------------------------------------
        // TRANSFORM ROLES
        // ----------------------------------------------------

        const mappedRecommendations: CareerRecommendation[] =
          roles.map((item) => {
            const roleProperties =
              item.role?.properties ?? {};

            // ==================================================
            // MATCHED SKILLS
            // ==================================================

            const matchedSkills: RecommendationSkill[] =
              (item.matchedSkills ?? []).map(
                (skill) => {
                  const properties =
                    skill.properties ?? {};

                  const name =
                    properties.name ||
                    skill.id;

                  const slug =
                    properties.slug ||
                    name
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g, "-") ||
                    skill.id;

                  return {
                    id: skill.id,

                    name,

                    slug,

                    category:
                      properties.category ||
                      "Other",

                    description:
                      properties.description,
                  };
                }
              );

            // ==================================================
            // MATCH SCORE
            // ==================================================

            const totalSkills =
              validSkillSlugs.length;

            const matchScore =
              totalSkills > 0
                ? Math.min(
                    100,
                    Math.round(
                      (item.matchCount /
                        totalSkills) *
                        100
                    )
                  )
                : 0;

            // ==================================================
            // MATCHED SLUG SET
            // ==================================================

            const matchedSlugSet = new Set(
              matchedSkills.map((skill) =>
                skill.slug.toLowerCase()
              )
            );

            // ==================================================
            // MISSING SKILLS
            //
            // We compare selected skills with matched skills.
            // ==================================================

            const missingSkills: RecommendationSkill[] =
              validSkillSlugs
                .filter(
                  (slug) =>
                    !matchedSlugSet.has(
                      slug.toLowerCase()
                    )
                )
                .map((slug) => {
                  const graphSkill =
                    graphNodes.find((node) => {
                      const properties =
                        node.properties ?? {};

                      const nodeSlug =
                        properties.slug ||
                        properties.name
                          ?.toLowerCase()
                          .trim()
                          .replace(
                            /\s+/g,
                            "-"
                          );

                      return (
                        nodeSlug?.toLowerCase() ===
                        slug.toLowerCase()
                      );
                    });

                  const properties =
                    graphSkill?.properties ?? {};

                  return {
                    id:
                      graphSkill?.id ||
                      slug,

                    name:
                      properties.name ||
                      slug,

                    slug:
                      properties.slug ||
                      slug,

                    category:
                      properties.category ||
                      "Other",

                    description:
                      properties.description,
                  };
                });

            // ==================================================
            // FINAL RECOMMENDATION
            // ==================================================

            return {
              id: item.role.id,

              name:
                roleProperties.name ||
                "Unknown Role",

              slug:
                roleProperties.slug ||
                item.role.id,

              category:
                roleProperties.category ||
                "Career",

              level:
                roleProperties.level ||
                roleProperties.experienceLevel,

              description:
                roleProperties.description,

              salaryRange:
                roleProperties.salaryRange,

              matchScore,

              matchedSkills,

              missingSkills,
            };
          });

        // ------------------------------------------------------
        // SORT BY MATCH SCORE
        // ------------------------------------------------------

        mappedRecommendations.sort(
          (a, b) =>
            b.matchScore - a.matchScore
        );

        // ------------------------------------------------------
        // SAVE
        // ------------------------------------------------------

        setRecommendations(
          mappedRecommendations
        );

        return mappedRecommendations;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to get career recommendations";

        setError(message);

        setRecommendations([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshRecommendations = useCallback(
    async (skillSlugs: string[]) => {
      return getRecommendations(skillSlugs);
    },
    [getRecommendations]
  );

  // ==========================================================
  // CLEAR RECOMMENDATIONS
  // ==========================================================

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);

    setError(null);
  }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    recommendations,

    loading,

    error,

    getRecommendations,

    refreshRecommendations,

    clearRecommendations,

    clearError,
  };
}