// ============================================================
// SKILL TYPES
// ============================================================

export type SkillLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

// ============================================================
// RELATED SKILL
// ============================================================

export interface RelatedSkill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
}

// ============================================================
// SKILL
// ============================================================

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;

  description?: string;

  level?: SkillLevel;

  proficiency?: string;

  /**
   * Actual role names connected through:
   * (Skill)-[:REQUIRES]->(Role)
   */
  relatedRoles: string[];

  /**
   * Same role names exposed for frontend compatibility.
   */
  relatedRoleNames: string[];

  /**
   * Number of connected roles.
   */
  relatedRoleCount: number;
}

// ============================================================
// SKILL WITH RELATED SKILLS
// ============================================================

export interface SkillWithRelatedSkills
  extends Skill {
  relatedSkills: RelatedSkill[];
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
  id?: string;
  slug?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}