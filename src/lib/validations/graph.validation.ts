// ============================================================
// GRAPH VALIDATION
// ============================================================

import {
  z,
  ZodError,
} from "zod";

// ============================================================
// GRAPH ID PARAMS
// ============================================================

export const graphIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Graph node ID is required"),
});

// ============================================================
// GRAPH QUERY
// ============================================================

export const graphQuerySchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Graph node ID is required"),

  type: z
    .enum([
      "skill",
      "role",
      "project",
      "category",
    ])
    .optional(),

  depth: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .default(2),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(50),
});

// ============================================================
// GRAPH EXPLORE QUERY
// ============================================================

export const graphExploreSchema = z.object({
  nodeId: z
    .string()
    .trim()
    .min(1, "Node ID is required"),

  nodeType: z
    .enum([
      "skill",
      "role",
      "project",
      "category",
    ])
    .optional(),

  depth: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(5)
    .default(2),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(50),
});

// ============================================================
// RELATIONSHIP TYPES
// ============================================================

export const graphRelationshipSchema =
  z.object({
    relationship: z
      .enum([
        "RELATED_TO",
        "REQUIRES",
        "BELONGS_TO",
        "HAS_SKILL",
        "SIMILAR_TO",
        "LEADS_TO",
      ])
      .optional(),
  });

// ============================================================
// GRAPH SEARCH
// ============================================================

export const graphSearchSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, "Search query is required")
    .max(
      100,
      "Search query must not exceed 100 characters"
    ),

  type: z
    .enum([
      "skill",
      "role",
      "project",
      "category",
    ])
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
// VALIDATION HELPERS
// ============================================================

export function validateGraphId(
  value: unknown
) {
  return graphIdSchema.parse({
    id: value,
  });
}

export function validateGraphQuery(
  value: unknown
) {
  return graphQuerySchema.parse(value);
}

export function validateGraphExplore(
  value: unknown
) {
  return graphExploreSchema.parse(value);
}

export function validateGraphSearch(
  value: unknown
) {
  return graphSearchSchema.parse(value);
}

// ============================================================
// SAFE VALIDATION
// ============================================================

export function safeValidateGraphQuery(
  value: unknown
) {
  return graphQuerySchema.safeParse(
    value
  );
}

// ============================================================
// VALIDATION ERROR FORMATTER
// ============================================================

export function getGraphValidationErrors(
  error: unknown
): Record<string, string[]> {
  if (!(error instanceof ZodError)) {
    return {
      general: [
        "Invalid graph request",
      ],
    };
  }

  return error.flatten()
    .fieldErrors as Record<
    string,
    string[]
  >;
}