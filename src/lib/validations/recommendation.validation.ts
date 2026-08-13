import { z } from "zod";

// ============================================================
// RECOMMENDATION TYPES
// ============================================================

export const recommendationTypeSchema = z.enum([
  "career",
  "top",
  "category",
  "next-skills",
  "summary",
]);

// ============================================================
// RECOMMENDATION QUERY
// ============================================================

export const recommendationQuerySchema = z.object({
  type: recommendationTypeSchema
    .optional()
    .default("career"),

  skillSlugs: z
    .string()
    .trim()
    .min(1, "skillSlugs is required")
    .transform((value) =>
      value
        .split(",")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean)
    ),

  category: z
    .string()
    .trim()
    .min(1)
    .optional(),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(10),
});

// ============================================================
// VALIDATOR
// ============================================================

export function validateRecommendationQuery(
  value: unknown
) {
  return recommendationQuerySchema.parse(value);
}

// ============================================================
// TYPES
// ============================================================

export type RecommendationQuery = z.infer<
  typeof recommendationQuerySchema
>;
