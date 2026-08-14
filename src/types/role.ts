// ============================================================
// EXPERIENCE LEVEL
// ============================================================

export type ExperienceLevel =
  | "Entry"
  | "Junior"
  | "Mid"
  | "Senior"
  | "Lead";

// ============================================================
// ROLE SKILL
// ============================================================

export interface RoleSkill {
  id: string;
  name: string;
  slug: string;

  category?: string;
  description?: string;

  /**
   * Optional metadata for role-skill relationship.
   */
  importance?: number;
  required?: boolean;
}

// ============================================================
// ROLE
// ============================================================

export interface Role {
  id: string;
  name: string;
  slug: string;
  category: string;

  description?: string;
  salaryRange?: string;

  experienceLevel?: ExperienceLevel;

  /**
   * Required skills for this role.
   */
  skills?: RoleSkill[];
}

// ============================================================
// CREATE ROLE INPUT
// ============================================================

export interface CreateRoleInput {
  name: string;
  slug: string;
  category: string;

  description?: string | null;
  salaryRange?: string | null;

  experienceLevel?: ExperienceLevel;

  /**
   * Skill IDs or skill slugs.
   *
   * These are used by the service to create
   * Role -[:REQUIRES]-> Skill relationships.
   */
  skills?: string[];
}

// ============================================================
// UPDATE ROLE INPUT
// ============================================================

export interface UpdateRoleInput {
  name?: string;
  slug?: string;
  category?: string;

  description?: string | null;
  salaryRange?: string | null;

  experienceLevel?: ExperienceLevel;

  /**
   * Skill IDs or skill slugs.
   *
   * If supplied, the service can synchronize
   * the Role -[:REQUIRES]-> Skill relationships.
   */
  skills?: string[];
}

// ============================================================
// ROLE FILTERS
// ============================================================

export interface RoleFilters {
  category?: string;
  experienceLevel?: ExperienceLevel;
}

// ============================================================
// ROLE QUERY
// ============================================================

export interface RoleQuery {
  category?: string;
  experienceLevel?: ExperienceLevel;
  search?: string;

  page?: number;
  limit?: number;
}

// ============================================================
// ROLE SEARCH
// ============================================================

export interface RoleSearchQuery {
  search?: string;
  category?: string;
  experienceLevel?: ExperienceLevel;
  limit?: number;
}

// ============================================================
// ROLE WITH SKILLS
// ============================================================

export interface RoleWithSkills extends Role {
  skills: RoleSkill[];
}

// ============================================================
// ROLE SUMMARY
// ============================================================

export interface RoleSummary {
  id: string;
  name: string;
  slug: string;
  category: string;

  skillCount?: number;
  experienceLevel?: ExperienceLevel;
}

// ============================================================
// ROLE DETAIL
// ============================================================

export interface RoleDetail extends Role {
  skills: RoleSkill[];

  relatedRoles?: RoleSummary[];
}

// ============================================================
// ROLE WITH RELATED ROLES
// ============================================================

export interface RoleWithRelatedRoles extends Role {
  relatedRoles: RoleSummary[];
}

// ============================================================
// ROLE LIST RESPONSE
// ============================================================

export interface RoleListResponse {
  roles: Role[];
  count: number;
}

// ============================================================
// ROLE DETAIL RESPONSE
// ============================================================

export interface RoleDetailResponse {
  role: RoleDetail;
}
