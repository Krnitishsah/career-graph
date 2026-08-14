// ============================================================
// SKILL VALIDATION
// ============================================================

import { z, ZodError } from "zod";

// ============================================================
// SKILL CATEGORIES
// ============================================================

export const skillCategorySchema = z.enum([
  "Frontend",
  "Backend",
  "Database",
  "State Management",
  "Mobile",
  "DevOps",
  "Tools",
  "Cloud",
  "Testing",
  "AI/ML",
]);

// ============================================================
// SKILL LEVEL
// ============================================================

export const skillLevelSchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

// ============================================================
// CREATE SKILL
// ============================================================

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  category: z
    .string()
    .trim()
    .min(2)
    .max(100),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable(),

  level: skillLevelSchema.optional(),
});

// ============================================================
// UPDATE SKILL
// ============================================================

export const updateSkillSchema =
  createSkillSchema.partial();

// ============================================================
// SKILL ID
// ============================================================

export const skillIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Skill ID is required"),
});

// ============================================================
// SKILL SLUG
// ============================================================

export const skillSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Skill slug is required"),
});

// ============================================================
// SKILL LIST QUERY
// ============================================================

export const skillQuerySchema = z.object({
  id: z
    .string()
    .trim()
    .optional(),

  slug: z
    .string()
    .trim()
    .optional(),

  category: z
    .string()
    .trim()
    .optional(),

  search: z
    .string()
    .trim()
    .optional(),

  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

// ============================================================
// SEARCH
// ============================================================

export const skillSearchSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1)
    .max(100),

  category: z
    .string()
    .trim()
    .optional(),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

// ============================================================
// RELATED SKILLS
// ============================================================

export const relatedSkillsSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1),

  depth: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function validateCreateSkill(
  value: unknown
) {
  return createSkillSchema.parse(value);
}

export function validateUpdateSkill(
  value: unknown
) {
  return updateSkillSchema.parse(value);
}

export function validateSkillId(
  value: unknown
) {
  return skillIdSchema.parse({
    id: value,
  });
}

export function validateSkillSlug(
  value: unknown
) {
  return skillSlugSchema.parse({
    slug: value,
  });
}

export function validateSkillQuery(
  value: unknown
) {
  return skillQuerySchema.parse(value);
}

export function validateSkillSearch(
  value: unknown
) {
  return skillSearchSchema.parse(value);
}

export function validateRelatedSkills(
  value: unknown
) {
  return relatedSkillsSchema.parse(value);
}

// ============================================================
// SAFE VALIDATION
// ============================================================

export function safeValidateCreateSkill(
  value: unknown
) {
  return createSkillSchema.safeParse(value);
}

export function safeValidateUpdateSkill(
  value: unknown
) {
  return updateSkillSchema.safeParse(value);
}

export function safeValidateSkillQuery(
  value: unknown
) {
  return skillQuerySchema.safeParse(value);
}

export function safeValidateSkillSearch(
  value: unknown
) {
  return skillSearchSchema.safeParse(value);
}

// ============================================================
// ERROR FORMATTER
// ============================================================

export function getSkillValidationErrors(
  error: unknown
): Record<string, string[]> {
  if (!(error instanceof ZodError)) {
    return {
      general: ["Invalid skill request"],
    };
  }

  return error.flatten()
    .fieldErrors as Record<
    string,
    string[]
  >;
}