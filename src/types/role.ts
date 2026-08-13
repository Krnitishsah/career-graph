// ============================================================
// ROLE TYPES
// ============================================================

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
// ROLE
// ============================================================

export interface Role {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;

  experienceLevel?: ExperienceLevel;

  skills?: RoleSkill[];
}

// ============================================================
// ROLE SKILL
// ============================================================

export interface RoleSkill {
  id: string;
  name: string;
  slug: string;
  category?: string;

  importance?: number;
  required?: boolean;
}

// ============================================================
// CREATE ROLE INPUT
// ============================================================

export interface CreateRoleInput {
  name: string;
  slug: string;
  category: string;
  description?: string | null;

  experienceLevel?: ExperienceLevel;

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

  experienceLevel?: ExperienceLevel;

  skills?: string[];
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
  search: string;
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

  skillCount: number;
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
// ROLE RESPONSE
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