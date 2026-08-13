// ============================================================
// ROLE VALIDATION
// ============================================================

import { z, ZodError } from "zod";

// ============================================================
// ENUMS
// ============================================================

export const roleTypeSchema = z.enum([
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "DevOps",
  "Data",
  "AI/ML",
  "QA",
  "Cloud",
  "Product",
]);

export const experienceLevelSchema = z.enum([
  "Entry",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
]);

// ============================================================
// CREATE ROLE
// ============================================================

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(100, "Role name must not exceed 100 characters"),

  slug: z
    .string()
    .trim()
    .min(2, "Role slug is required")
    .max(120, "Role slug must not exceed 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  category: z
    .string()
    .trim()
    .min(2, "Role category is required")
    .max(100, "Role category must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Description must not exceed 1000 characters"
    )
    .optional()
    .nullable(),

  experienceLevel: experienceLevelSchema.optional(),

  skills: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Skill ID cannot be empty")
    )
    .max(
      100,
      "A role cannot contain more than 100 skills"
    )
    .optional()
    .default([]),
});

// ============================================================
// UPDATE ROLE
// ============================================================

export const updateRoleSchema =
  createRoleSchema.partial().extend({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format"
      )
      .optional(),
  });

// ============================================================
// ROLE ID PARAMS
// ============================================================

export const roleIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Role ID is required"),
});

// ============================================================
// ROLE SLUG PARAMS
// ============================================================

export const roleSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Role slug is required"),
});

// ============================================================
// ROLE SEARCH
// ============================================================

export const roleSearchSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(
      100,
      "Search query must not exceed 100 characters"
    ),

  category: z
    .string()
    .trim()
    .optional(),

  experienceLevel:
    experienceLevelSchema.optional(),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),
});

// ============================================================
// ROLE LIST QUERY
// ============================================================

export const roleQuerySchema = z.object({
  category: z
    .string()
    .trim()
    .optional(),

  experienceLevel:
    experienceLevelSchema.optional(),

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

  search: z
    .string()
    .trim()
    .optional(),
});

// ============================================================
// ROLE WITH SKILLS
// ============================================================

export const roleWithSkillsSchema =
  z.object({
    id: z
      .string()
      .trim()
      .min(1, "Role ID is required"),

    includeSkills: z
      .coerce
      .boolean()
      .default(true),
  });

// ============================================================
// VALIDATION HELPERS
// ============================================================

export function validateCreateRole(
  value: unknown
) {
  return createRoleSchema.parse(value);
}

export function validateUpdateRole(
  value: unknown
) {
  return updateRoleSchema.parse(value);
}

export function validateRoleId(
  value: unknown
) {
  return roleIdSchema.parse({
    id: value,
  });
}

export function validateRoleSlug(
  value: unknown
) {
  return roleSlugSchema.parse({
    slug: value,
  });
}

export function validateRoleQuery(
  value: unknown
) {
  return roleQuerySchema.parse(value);
}

export function validateRoleSearch(
  value: unknown
) {
  return roleSearchSchema.parse(value);
}

// ============================================================
// SAFE VALIDATION
// ============================================================

export function safeValidateCreateRole(
  value: unknown
) {
  return createRoleSchema.safeParse(value);
}

export function safeValidateUpdateRole(
  value: unknown
) {
  return updateRoleSchema.safeParse(value);
}

// ============================================================
// VALIDATION ERROR FORMATTER
// ============================================================

export function getRoleValidationErrors(
  error: unknown
): Record<string, string[]> {
  if (!(error instanceof ZodError)) {
    return {
      general: ["Invalid role request"],
    };
  }

  return error.flatten().fieldErrors as Record<
    string,
    string[]
  >;
}