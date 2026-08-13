// ============================================================
// ROLE CONSTANTS
// ============================================================

// ------------------------------------------------------------
// ROLE CATEGORIES
// ------------------------------------------------------------

export const ROLE_CATEGORIES = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULL_STACK: "Full Stack",
  MOBILE: "Mobile",
  DEVOPS: "DevOps",
  DATA: "Data",
  CLOUD: "Cloud",
  QA: "QA",
  SECURITY: "Security",
} as const;

// ------------------------------------------------------------
// EXPERIENCE LEVELS
// ------------------------------------------------------------

export const ROLE_LEVELS = {
  ENTRY: "Entry Level",
  JUNIOR: "Junior",
  MID: "Mid Level",
  SENIOR: "Senior",
  LEAD: "Lead",
} as const;

// ------------------------------------------------------------
// ROLE TYPES
// ------------------------------------------------------------

export const ROLE_TYPES = {
 TECHNICAL: "Technical",
  MANAGEMENT: "Management",
  SPECIALIST: "Specialist",
} as const;

// ------------------------------------------------------------
// COMMON ROLE SLUGS
// ------------------------------------------------------------

export const ROLE_SLUGS = {
  FRONTEND_DEVELOPER: "frontend-developer",
  REACT_DEVELOPER: "react-developer",
  NEXTJS_DEVELOPER: "nextjs-developer",
  FULLSTACK_DEVELOPER: "fullstack-developer",
  BACKEND_DEVELOPER: "backend-developer",
  NODEJS_DEVELOPER: "nodejs-developer",
  MOBILE_DEVELOPER: "mobile-developer",
  DEVOPS_ENGINEER: "devops-engineer",
  SOFTWARE_ENGINEER: "software-engineer",
} as const;

// ------------------------------------------------------------
// ROLE API
// ------------------------------------------------------------

export const ROLE_API = {
  BASE: "/api/roles",
  SEARCH: "/api/roles?search=",
  BY_ID: "/api/roles?id=",
  BY_SLUG: "/api/roles?slug=",
  BY_CATEGORY: "/api/roles?category=",
} as const;

// ------------------------------------------------------------
// ROLE QUERY PARAMETERS
// ------------------------------------------------------------

export const ROLE_QUERY_PARAMS = {
  ID: "id",
  SLUG: "slug",
  SEARCH: "search",
  CATEGORY: "category",
  LEVEL: "level",
  TYPE: "type",
} as const;

// ------------------------------------------------------------
// ROLE DISPLAY
// ------------------------------------------------------------

export const ROLE_DISPLAY = {
  DEFAULT_LIMIT: 20,
  RECOMMENDATION_LIMIT: 10,
  RELATED_ROLE_LIMIT: 6,
} as const;

// ------------------------------------------------------------
// TYPE HELPERS
// ------------------------------------------------------------

export type RoleCategory =
  (typeof ROLE_CATEGORIES)[keyof typeof ROLE_CATEGORIES];

export type RoleLevel =
  (typeof ROLE_LEVELS)[keyof typeof ROLE_LEVELS];

export type RoleType =
  (typeof ROLE_TYPES)[keyof typeof ROLE_TYPES];

export type RoleSlug =
  (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS];