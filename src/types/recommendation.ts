// ============================================================
// RECOMMENDATION TYPES
// ============================================================

// ============================================================
// RECOMMENDATION TYPE
// ============================================================

export type RecommendationType =
  | "role"
  | "skill"
  | "project";

// ============================================================
// MATCH LEVEL
// ============================================================

export type MatchLevel =
  | "excellent"
  | "good"
  | "average"
  | "low";

// ============================================================
// RECOMMENDED SKILL
// ============================================================

export interface RecommendedSkill {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;

  matchScore?: number;
  matchLevel?: MatchLevel;

  reason?: string;
}

// ============================================================
// RECOMMENDED ROLE
// ============================================================

export interface RecommendedRole {
  id: string;
  name: string;
  slug: string;
  category?: string;
  description?: string;

  matchScore: number;
  matchLevel: MatchLevel;

  matchedSkills: string[];
  missingSkills: string[];

  reason?: string;
}

// ============================================================
// RECOMMENDED PROJECT
// ============================================================

export interface RecommendedProject {
  id: string;
  name: string;
  slug?: string;
  description?: string;

  matchScore: number;
  matchLevel: MatchLevel;

  matchedSkills: string[];

  reason?: string;
}

// ============================================================
// RECOMMENDATION QUERY
// ============================================================

export interface RecommendationQuery {
  skillIds?: string[];
  roleId?: string;

  search?: string;

  limit?: number;
  minScore?: number;
}

// ============================================================
// ROLE RECOMMENDATION QUERY
// ============================================================

export interface RoleRecommendationQuery {
  skillIds: string[];
  limit?: number;
  minScore?: number;
}

// ============================================================
// SKILL RECOMMENDATION QUERY
// ============================================================

export interface SkillRecommendationQuery {
  skillIds: string[];
  roleId?: string;

  limit?: number;
}

// ============================================================
// RECOMMENDATION RESULT
// ============================================================

export interface RecommendationResult {
  type: RecommendationType;

  id: string;
  name: string;
  slug?: string;

  score: number;
  level: MatchLevel;

  reason?: string;
}

// ============================================================
// RECOMMENDATION RESPONSE
// ============================================================

export interface RecommendationResponse {
  recommendations: RecommendationResult[];
  count: number;
}

// ============================================================
// ROLE RECOMMENDATION RESPONSE
// ============================================================

export interface RoleRecommendationResponse {
  recommendations: RecommendedRole[];
  count: number;
}

// ============================================================
// SKILL RECOMMENDATION RESPONSE
// ============================================================

export interface SkillRecommendationResponse {
  recommendations: RecommendedSkill[];
  count: number;
}

// ============================================================
// RECOMMENDATION SUMMARY
// ============================================================

export interface RecommendationSummary {
  total: number;
  excellent: number;
  good: number;
  average: number;
  low: number;
}

// ============================================================
// CAREER RECOMMENDATION
// ============================================================

export interface CareerRecommendation {
  role: RecommendedRole;
  recommendedSkills: RecommendedSkill[];
  missingSkills: RecommendedSkill[];
  summary: RecommendationSummary;
}