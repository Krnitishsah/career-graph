// ============================================================
// GRAPH CONSTANTS
// ============================================================

// ------------------------------------------------------------
// NODE LABELS
// ------------------------------------------------------------

export const GRAPH_NODE_LABELS = {
  SKILL: "Skill",
  ROLE: "Role",
  CATEGORY: "Category",
} as const;

// ------------------------------------------------------------
// RELATIONSHIP TYPES
// ------------------------------------------------------------

export const GRAPH_RELATIONSHIPS = {
  REQUIRES: "REQUIRES",
  RELATED_TO: "RELATED_TO",
  LEADS_TO: "LEADS_TO",
  BELONGS_TO: "BELONGS_TO",
} as const;

// ------------------------------------------------------------
// SKILL CATEGORIES
// ------------------------------------------------------------

export const SKILL_CATEGORIES = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  STATE_MANAGEMENT: "State Management",
  MOBILE: "Mobile",
  DEVOPS: "DevOps",
  TOOLS: "Tools",
} as const;

// ------------------------------------------------------------
// ROLE CATEGORIES
// ------------------------------------------------------------

export const ROLE_CATEGORIES = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  MOBILE: "Mobile",
  DEVOPS: "DevOps",
  DATA: "Data",
} as const;

// ------------------------------------------------------------
// EXPERIENCE LEVELS
// ------------------------------------------------------------

export const EXPERIENCE_LEVELS = {
  ENTRY: "Entry Level",
  JUNIOR: "Junior",
  MID: "Mid Level",
  SENIOR: "Senior",
  LEAD: "Lead",
} as const;

// ------------------------------------------------------------
// GRAPH QUERY DEFAULTS
// ------------------------------------------------------------

export const GRAPH_DEFAULTS = {
  MAX_RECOMMENDATIONS: 10,
  MAX_RELATED_SKILLS: 10,
  MAX_GRAPH_NODES: 100,
  MAX_GRAPH_RELATIONSHIPS: 200,
} as const;

// ------------------------------------------------------------
// RECOMMENDATION SCORE
// ------------------------------------------------------------

export const RECOMMENDATION_SCORE = {
  MIN: 0,
  MAX: 100,
  PERFECT_MATCH: 100,
  STRONG_MATCH: 80,
  GOOD_MATCH: 60,
  PARTIAL_MATCH: 40,
} as const;

// ------------------------------------------------------------
// GRAPH API
// ------------------------------------------------------------

export const GRAPH_API = {
  SKILLS: "/api/skills",
  ROLES: "/api/roles",
  GRAPH: "/api/graph",
} as const;

// ------------------------------------------------------------
// GRAPH QUERY PARAMETERS
// ------------------------------------------------------------

export const GRAPH_QUERY_PARAMS = {
  SKILLS: "skills",
  ROLE_ID: "roleId",
  ROLE_SLUG: "roleSlug",
  SKILL_ID: "skillId",
  SKILL_SLUG: "skillSlug",
  SEARCH: "search",
  CATEGORY: "category",
} as const;

// ------------------------------------------------------------
// TYPE HELPERS
// ------------------------------------------------------------

export type GraphNodeLabel =
  (typeof GRAPH_NODE_LABELS)[keyof typeof GRAPH_NODE_LABELS];

export type GraphRelationship =
  (typeof GRAPH_RELATIONSHIPS)[keyof typeof GRAPH_RELATIONSHIPS];

export type SkillCategory =
  (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];

export type RoleCategory =
  (typeof ROLE_CATEGORIES)[keyof typeof ROLE_CATEGORIES];

export type ExperienceLevel =
  (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];