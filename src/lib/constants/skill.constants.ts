// ============================================================
// SKILL CONSTANTS
// ============================================================

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
  TESTING: "Testing",
  CLOUD: "Cloud",
  SECURITY: "Security",
} as const;

// ------------------------------------------------------------
// COMMON SKILL SLUGS
// ------------------------------------------------------------

export const SKILL_SLUGS = {
  JAVASCRIPT: "javascript",
  TYPESCRIPT: "typescript",
  REACT: "react",
  NEXTJS: "nextjs",
  HTML: "html",
  CSS: "css",
  TAILWIND_CSS: "tailwind-css",

  NODEJS: "nodejs",
  EXPRESSJS: "expressjs",
  REST_API: "rest-api",

  MONGODB: "mongodb",
  POSTGRESQL: "postgresql",
  NEO4J: "neo4j",

  REDUX_TOOLKIT: "redux-toolkit",
  RTK_QUERY: "rtk-query",

  REACT_NATIVE: "react-native",
  EXPO: "expo",

  GIT: "git",
  GITHUB: "github",
  DOCKER: "docker",
  POSTMAN: "postman",
} as const;

// ------------------------------------------------------------
// SKILL API
// ------------------------------------------------------------

export const SKILL_API = {
  BASE: "/api/skills",
  SEARCH: "/api/skills?search=",
  BY_ID: "/api/skills?id=",
  BY_SLUG: "/api/skills?slug=",
  BY_CATEGORY: "/api/skills?category=",
} as const;

// ------------------------------------------------------------
// SKILL QUERY PARAMETERS
// ------------------------------------------------------------

export const SKILL_QUERY_PARAMS = {
  ID: "id",
  SLUG: "slug",
  SEARCH: "search",
  CATEGORY: "category",
} as const;

// ------------------------------------------------------------
// SKILL DISPLAY
// ------------------------------------------------------------

export const SKILL_DISPLAY = {
  DEFAULT_LIMIT: 50,
  RELATED_SKILLS_LIMIT: 10,
  RECOMMENDATION_SKILLS_LIMIT: 20,
} as const;

// ------------------------------------------------------------
// SKILL PROFICIENCY
// ------------------------------------------------------------

export const SKILL_PROFICIENCY = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
} as const;

// ------------------------------------------------------------
// SKILL SCORE
// ------------------------------------------------------------

export const SKILL_SCORE = {
  MIN: 0,
  MAX: 100,
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
} as const;

// ------------------------------------------------------------
// TYPE HELPERS
// ------------------------------------------------------------

export type SkillCategory =
  (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES];

export type SkillSlug =
  (typeof SKILL_SLUGS)[keyof typeof SKILL_SLUGS];

export type SkillProficiency =
  (typeof SKILL_PROFICIENCY)[keyof typeof SKILL_PROFICIENCY];