// ============================================================
// ROLE SERVICE
// ============================================================

import type { Record as Neo4jRecord } from "neo4j-driver";

import { getCognoDBDriver } from "../cognodb";

import {
  GET_ALL_ROLES,
  GET_ROLE_BY_ID,
  GET_ROLE_BY_SLUG,
  SEARCH_ROLES,
  GET_ROLES_BY_CATEGORY,
  GET_ROLES_BY_LEVEL,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  GET_ROLE_SKILLS,
  GET_ROLE_WITH_RELATED_ROLES,
  ROLE_EXISTS,
  COUNT_ROLES,
} from "../queries/role.queries";

import type {
  CreateRoleInput,
  UpdateRoleInput,
  Role,
  RoleSkill,
  RoleWithSkills,
  RoleWithRelatedRoles,
  RoleSummary,
  ExperienceLevel,
} from "../../types/role";

// ============================================================
// TYPES
// ============================================================

export interface RoleFilters {
  category?: string;
  experienceLevel?: ExperienceLevel;
}

// ============================================================
// HELPERS
// ============================================================

function getStringValue(
  value: unknown,
): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return String(value);
}

function getExperienceLevel(
  value: unknown,
): ExperienceLevel | undefined {
  const level = getStringValue(value);

  if (
    level === "Entry" ||
    level === "Junior" ||
    level === "Mid" ||
    level === "Senior" ||
    level === "Lead"
  ) {
    return level;
  }

  return undefined;
}

// ============================================================
// MAP SKILL
// ============================================================

function mapSkill(
  skill: unknown,
): RoleSkill | null {
  if (!skill) {
    return null;
  }

  const properties =
    typeof skill === "object" &&
    skill !== null &&
    "properties" in skill
      ? (skill as { properties?: Record<string, unknown> })
          .properties ?? {}
      : (skill as Record<string, unknown>);

  const id = getStringValue(properties.id);

  if (!id) {
    return null;
  }

  return {
    id,
    name:
      getStringValue(properties.name) ?? "",
    slug:
      getStringValue(properties.slug) ?? "",
    category:
      getStringValue(properties.category),
    description:
      getStringValue(properties.description),
    importance:
      typeof properties.importance === "number"
        ? properties.importance
        : undefined,
    required:
      typeof properties.required === "boolean"
        ? properties.required
        : undefined,
  };
}

// ============================================================
// MAP SKILLS FROM RECORD
// ============================================================

function mapRecordSkills(
  record: Neo4jRecord,
): RoleSkill[] {
  const rawSkills = record.get("skills");

  if (!Array.isArray(rawSkills)) {
    return [];
  }

  return rawSkills
    .map(mapSkill)
    .filter(
      (skill): skill is RoleSkill =>
        Boolean(skill),
    );
}

// ============================================================
// MAP ROLE RECORD
// ============================================================

function mapRoleRecord(
  record: Neo4jRecord,
): Role {
  return {
    id:
      getStringValue(
        record.get("id"),
      ) ?? "",

    name:
      getStringValue(
        record.get("name"),
      ) ?? "",

    slug:
      getStringValue(
        record.get("slug"),
      ) ?? "",

    category:
      getStringValue(
        record.get("category"),
      ) ?? "",

    experienceLevel:
      getExperienceLevel(
        record.get(
          "experienceLevel",
        ),
      ),

    description:
      getStringValue(
        record.get(
          "description",
        ),
      ),

    salaryRange:
      getStringValue(
        record.get(
          "salaryRange",
        ),
      ),

    skills:
      mapRecordSkills(record),
  };
}

// ============================================================
// MAP ROLE WITH SKILLS
// ============================================================

function mapRoleWithSkills(
  record: Neo4jRecord,
): RoleWithSkills {
  const role = mapRoleRecord(record);

  return {
    ...role,
    skills:
      mapRecordSkills(record),
  };
}

// ============================================================
// MAP ROLE SUMMARY
// ============================================================

function mapRoleSummary(
  role: unknown,
): RoleSummary | null {
  if (!role) {
    return null;
  }

  const properties =
    typeof role === "object" &&
    role !== null &&
    "properties" in role
      ? (
          role as {
            properties?: Record<string, unknown>;
          }
        ).properties ?? {}
      : (role as Record<string, unknown>);

  const id =
    getStringValue(properties.id);

  if (!id) {
    return null;
  }

  return {
    id,

    name:
      getStringValue(
        properties.name,
      ) ?? "",

    slug:
      getStringValue(
        properties.slug,
      ) ?? "",

    category:
      getStringValue(
        properties.category,
      ) ?? "",

    experienceLevel:
      getExperienceLevel(
        properties.experienceLevel,
      ),
  };
}

// ============================================================
// GET ALL ROLES
// ============================================================

export async function getAllRoles(
  filters?: RoleFilters,
): Promise<Role[]> {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    // --------------------------------------------------------
    // CATEGORY + EXPERIENCE LEVEL
    // --------------------------------------------------------

    if (
      filters?.category &&
      filters?.experienceLevel
    ) {
      const result =
        await session.run(
          `
            MATCH (r:Role)

            WHERE
              r.category = $category
              AND
              r.experienceLevel = $experienceLevel

            OPTIONAL MATCH
              (r)-[:REQUIRES]->(s:Skill)

            RETURN
              r.id AS id,
              r.name AS name,
              r.slug AS slug,
              r.category AS category,
              r.experienceLevel AS experienceLevel,
              r.description AS description,
              r.salaryRange AS salaryRange,

              collect(
                CASE
                  WHEN s IS NULL THEN NULL
                  ELSE {
                    id: s.id,
                    name: s.name,
                    slug: s.slug,
                    category: s.category,
                    description: s.description
                  }
                END
              ) AS skills

            ORDER BY r.name ASC
          `,
          {
            category:
              filters.category.trim(),

            experienceLevel:
              filters.experienceLevel,
          },
        );

      return result.records.map(
        mapRoleRecord,
      );
    }

    // --------------------------------------------------------
    // CATEGORY ONLY
    // --------------------------------------------------------

    if (filters?.category) {
      const result =
        await session.run(
          GET_ROLES_BY_CATEGORY,
          {
            category:
              filters.category.trim(),
          },
        );

      return result.records.map(
        mapRoleRecord,
      );
    }

    // --------------------------------------------------------
    // EXPERIENCE LEVEL ONLY
    // --------------------------------------------------------

    if (filters?.experienceLevel) {
      const result =
        await session.run(
          GET_ROLES_BY_LEVEL,
          {
            experienceLevel:
              filters.experienceLevel,
          },
        );

      return result.records.map(
        mapRoleRecord,
      );
    }

    // --------------------------------------------------------
    // ALL ROLES
    // --------------------------------------------------------

    const result =
      await session.run(
        GET_ALL_ROLES,
      );

    return result.records.map(
      mapRoleRecord,
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE BY ID
// ============================================================

export async function getRoleById(
  id: string,
): Promise<RoleWithSkills | null> {
  if (!id?.trim()) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLE_BY_ID,
        {
          id: id.trim(),
        },
      );

    if (!result.records.length) {
      return null;
    }

    return mapRoleWithSkills(
      result.records[0],
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE BY SLUG
// ============================================================

export async function getRoleBySlug(
  slug: string,
): Promise<RoleWithSkills | null> {
  if (!slug?.trim()) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLE_BY_SLUG,
        {
          slug: slug.trim(),
        },
      );

    if (!result.records.length) {
      return null;
    }

    return mapRoleWithSkills(
      result.records[0],
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// SEARCH ROLES
// ============================================================

export async function searchRoles(
  search: string,
): Promise<Role[]> {
  if (!search?.trim()) {
    return getAllRoles();
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        SEARCH_ROLES,
        {
          search: search.trim(),
        },
      );

    return result.records.map(
      mapRoleRecord,
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLES BY CATEGORY
// ============================================================

export async function getRolesByCategory(
  category: string,
): Promise<Role[]> {
  if (!category?.trim()) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLES_BY_CATEGORY,
        {
          category:
            category.trim(),
        },
      );

    return result.records.map(
      mapRoleRecord,
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLES BY LEVEL
// ============================================================

export async function getRolesByLevel(
  level: ExperienceLevel,
): Promise<Role[]> {
  if (!level?.trim()) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLES_BY_LEVEL,
        {
          experienceLevel: level,
        },
      );

    return result.records.map(
      mapRoleRecord,
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// CREATE ROLE
// ============================================================

export async function createRole(
  input: CreateRoleInput,
): Promise<Role> {
  if (!input.name?.trim()) {
    throw new Error(
      "Role name is required",
    );
  }

  if (!input.slug?.trim()) {
    throw new Error(
      "Role slug is required",
    );
  }

  if (!input.category?.trim()) {
    throw new Error(
      "Role category is required",
    );
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const id = crypto.randomUUID();

    const result =
      await session.run(
        CREATE_ROLE,
        {
          id,

          name:
            input.name.trim(),

          slug:
            input.slug.trim(),

          category:
            input.category.trim(),

          experienceLevel:
            input.experienceLevel ??
            null,

          description:
            input.description?.trim() ??
            null,

          salaryRange:
            input.salaryRange?.trim() ??
            null,
        },
      );

    if (!result.records.length) {
      throw new Error(
        "Failed to create role",
      );
    }

    return mapRoleRecord(
      result.records[0],
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// UPDATE ROLE
// ============================================================

export async function updateRole(
  id: string,
  input: UpdateRoleInput,
): Promise<Role | null> {
  if (!id?.trim()) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        UPDATE_ROLE,
        {
          id: id.trim(),

          name:
            input.name !== undefined
              ? input.name.trim()
              : null,

          slug:
            input.slug !== undefined
              ? input.slug.trim()
              : null,

          category:
            input.category !== undefined
              ? input.category.trim()
              : null,

          experienceLevel:
            input.experienceLevel ??
            null,

          description:
            input.description !== undefined
              ? input.description
              : null,

          salaryRange:
            input.salaryRange !== undefined
              ? input.salaryRange
              : null,
        },
      );

    if (!result.records.length) {
      return null;
    }

    return mapRoleRecord(
      result.records[0],
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// DELETE ROLE
// ============================================================

export async function deleteRole(
  id: string,
): Promise<boolean> {
  if (!id?.trim()) {
    return false;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        DELETE_ROLE,
        {
          id: id.trim(),
        },
      );

    const deleted =
      result.records[0]?.get(
        "deleted",
      );

    return Number(
      deleted ?? 0,
    ) > 0;
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE WITH REQUIRED SKILLS
// ============================================================

export async function getRoleWithSkills(
  id: string,
): Promise<RoleWithSkills | null> {
  if (!id?.trim()) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLE_SKILLS,
        {
          id: id.trim(),
        },
      );

    if (!result.records.length) {
      return null;
    }

    return mapRoleWithSkills(
      result.records[0],
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE WITH RELATED ROLES
// ============================================================

export async function getRoleWithRelatedRoles(
  id: string,
): Promise<RoleWithRelatedRoles | null> {
  if (!id?.trim()) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        GET_ROLE_WITH_RELATED_ROLES,
        {
          id: id.trim(),
        },
      );

    if (!result.records.length) {
      return null;
    }

    const record =
      result.records[0];

    const role: Role = {
      id:
        getStringValue(
          record.get("id"),
        ) ?? "",

      name:
        getStringValue(
          record.get("name"),
        ) ?? "",

      slug:
        getStringValue(
          record.get("slug"),
        ) ?? "",

      category:
        getStringValue(
          record.get("category"),
        ) ?? "",

      experienceLevel:
        getExperienceLevel(
          record.get(
            "experienceLevel",
          ),
        ),

      description:
        getStringValue(
          record.get("description"),
        ),

      salaryRange:
        getStringValue(
          record.get("salaryRange"),
        ),
    };

    const rawRelatedRoles =
      record.get(
        "relatedRoles",
      );

    const relatedRoles: RoleSummary[] =
      Array.isArray(
        rawRelatedRoles,
      )
        ? rawRelatedRoles
            .map(mapRoleSummary)
            .filter(
              (
                relatedRole,
              ): relatedRole is RoleSummary =>
                Boolean(relatedRole),
            )
        : [];

    return {
      ...role,
      relatedRoles,
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// CHECK ROLE EXISTS
// ============================================================

export async function roleExists(
  id?: string,
  slug?: string,
): Promise<boolean> {
  if (
    !id?.trim() &&
    !slug?.trim()
  ) {
    return false;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        ROLE_EXISTS,
        {
          id:
            id?.trim() ?? "",

          slug:
            slug?.trim() ?? "",
        },
      );

    return Boolean(
      result.records[0]?.get(
        "exists",
      ),
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// COUNT ROLES
// ============================================================

export async function countRoles(): Promise<number> {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result =
      await session.run(
        COUNT_ROLES,
      );

    return Number(
      result.records[0]?.get(
        "count",
      ) ?? 0,
    );
  } finally {
    await session.close();
  }
}
