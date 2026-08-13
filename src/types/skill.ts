// ============================================================
// SKILL TYPES
// ============================================================

// ============================================================
// SKILL CATEGORY
// ============================================================

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "State Management"
  | "Mobile"
  | "DevOps"
  | "Tools"
  | "Cloud"
  | "Testing"
  | "AI/ML";

// ============================================================
// SKILL LEVEL
// ============================================================

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

// ============================================================
// SKILL
// ============================================================

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;

  description?: string;

  /**
   * Skill proficiency level used by SkillBadge / SkillCard.
   */
  level?: SkillLevel;

  /**
   * Alternative API field if backend returns proficiency.
   */
  proficiency?: SkillLevel | string;

  /**
   * Number of career roles related to this skill.
   */
  relatedRoles?: number;

  /**
   * Related role names for SkillSummary.
   */
  relatedRoleNames?: string[];
}

// ============================================================
// CREATE SKILL INPUT
// ============================================================

export interface CreateSkillInput {
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  level?: SkillLevel;
}

// ============================================================
// UPDATE SKILL INPUT
// ============================================================

export interface UpdateSkillInput {
  name?: string;
  slug?: string;
  category?: string;
  description?: string | null;
  level?: SkillLevel;
}

// ============================================================
// SKILL QUERY
// ============================================================

export interface SkillQuery {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================
// SKILL SEARCH
// ============================================================

export interface SkillSearchQuery {
  search: string;
  category?: string;
  limit?: number;
}

// ============================================================
// RELATED SKILL
// ============================================================

export interface RelatedSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;

  relationship?: string;
  distance?: number;
}

// ============================================================
// SKILL WITH RELATED SKILLS
// ============================================================

export interface SkillWithRelatedSkills extends Skill {
  relatedSkills: RelatedSkill[];
}

// ============================================================
// SKILL SUMMARY
// ============================================================

export interface SkillSummary {
  id: string;
  name: string;
  slug: string;
  category: string;

  description?: string;
  level?: SkillLevel;
  proficiency?: SkillLevel | string;
  relatedRoles?: number;
  relatedRoleNames?: string[];
}

// ============================================================
// SKILL LIST RESPONSE
// ============================================================

export interface SkillListResponse {
  skills: Skill[];
  count: number;
}

// ============================================================
// SKILL DETAIL RESPONSE
// ============================================================

export interface SkillDetailResponse {
  skill: Skill;
}

// ============================================================
// RELATED SKILLS RESPONSE
// ============================================================

export interface RelatedSkillsResponse {
  skill: Skill;
  relatedSkills: RelatedSkill[];
}