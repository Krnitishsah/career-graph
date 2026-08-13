// ============================================================
// ROLE SERVICE
// ============================================================

import type { Node } from "neo4j-driver";

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
  Role,
  RoleWithSkills,
  RoleWithRelatedRoles,
} from "../../types/role";

// ============================================================
// HELPERS
// ============================================================

function getStringValue(
  value: unknown
): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return String(value);
}

function mapRoleNode(node: Node): Role {
  const properties = node.properties;

  return {
    id: getStringValue(properties.id) ?? "",
    name: getStringValue(properties.name) ?? "",
    slug: getStringValue(properties.slug) ?? "",
    category: getStringValue(properties.category) ?? "",
    level: getStringValue(properties.level),
    description: getStringValue(properties.description),
    salaryRange: getStringValue(properties.salaryRange),
  };
}

function mapRoleRecord(record: any): Role {
  return {
    id: getStringValue(record.get("id")) ?? "",
    name: getStringValue(record.get("name")) ?? "",
    slug: getStringValue(record.get("slug")) ?? "",
    category:
      getStringValue(record.get("category")) ?? "",
    level: getStringValue(record.get("level")),
    description: getStringValue(
      record.get("description")
    ),
    salaryRange: getStringValue(
      record.get("salaryRange")
    ),
  };
}

// ============================================================
// GET ALL ROLES
// ============================================================

export async function getAllRoles(): Promise<Role[]> {
  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ALL_ROLES
    );

    return result.records.map(mapRoleRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE BY ID
// ============================================================

export async function getRoleById(
  id: string
): Promise<Role | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLE_BY_ID,
      { id }
    );

    if (!result.records.length) {
      return null;
    }

    return mapRoleRecord(result.records[0]);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE BY SLUG
// ============================================================

export async function getRoleBySlug(
  slug: string
): Promise<Role | null> {
  if (!slug) {
    return null;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLE_BY_SLUG,
      { slug }
    );

    if (!result.records.length) {
      return null;
    }

    return mapRoleRecord(result.records[0]);
  } finally {
    await session.close();
  }
}

// ============================================================
// SEARCH ROLES
// ============================================================

export async function searchRoles(
  search: string
): Promise<Role[]> {
  if (!search?.trim()) {
    return getAllRoles();
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      SEARCH_ROLES,
      {
        search: search.trim(),
      }
    );

    return result.records.map(mapRoleRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLES BY CATEGORY
// ============================================================

export async function getRolesByCategory(
  category: string
): Promise<Role[]> {
  if (!category) {
    return [];
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLES_BY_CATEGORY,
      { category }
    );

    return result.records.map(mapRoleRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLES BY LEVEL
// ============================================================

export async function getRolesByLevel(
  level: string
): Promise<Role[]> {
  if (!level) {
    return [];
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLES_BY_LEVEL,
      { level }
    );

    return result.records.map(mapRoleRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// CREATE ROLE
// ============================================================

export async function createRole(
  input: CreateRoleInput
): Promise<Role> {
  if (!input.name) {
    throw new Error("Role name is required");
  }

  if (!input.slug) {
    throw new Error("Role slug is required");
  }

  if (!input.category) {
    throw new Error("Role category is required");
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      CREATE_ROLE,
      {
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        level: input.level ?? null,
        description:
          input.description ?? null,
        salaryRange:
          input.salaryRange ?? null,
      }
    );

    if (!result.records.length) {
      throw new Error(
        "Failed to create role"
      );
    }

    return mapRoleRecord(
      result.records[0]
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
  input: CreateRoleInput
): Promise<Role | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      UPDATE_ROLE,
      {
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        level: input.level ?? null,
        description:
          input.description ?? null,
        salaryRange:
          input.salaryRange ?? null,
      }
    );

    if (!result.records.length) {
      return null;
    }

    return mapRoleRecord(
      result.records[0]
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// DELETE ROLE
// ============================================================

export async function deleteRole(
  id: string
): Promise<boolean> {
  if (!id) {
    return false;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      DELETE_ROLE,
      { id }
    );

    const deleted = result.records[0]?.get(
      "deleted"
    );

    return Number(deleted ?? 0) > 0;
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE WITH REQUIRED SKILLS
// ============================================================

export async function getRoleWithSkills(
  id: string
): Promise<RoleWithSkills | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLE_SKILLS,
      { id }
    );

    if (!result.records.length) {
      return null;
    }

    const record = result.records[0];

    const role: Role = {
      id:
        getStringValue(record.get("id")) ??
        "",
      name:
        getStringValue(record.get("name")) ??
        "",
      slug:
        getStringValue(record.get("slug")) ??
        "",
      category:
        getStringValue(
          record.get("category")
        ) ?? "",
      level: getStringValue(
        record.get("level")
      ),
      description: getStringValue(
        record.get("description")
      ),
      salaryRange: getStringValue(
        record.get("salaryRange")
      ),
    };

    const skills =
      (record.get("skills") as any[]) ?? [];

    return {
      ...role,
      skills: skills
        .filter(Boolean)
        .map((skill) => ({
          id:
            getStringValue(skill.id) ??
            "",
          name:
            getStringValue(skill.name) ??
            "",
          slug:
            getStringValue(skill.slug) ??
            "",
          category:
            getStringValue(
              skill.category
            ) ?? "",
          description:
            getStringValue(
              skill.description
            ),
        })),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE WITH RELATED ROLES
// ============================================================

export async function getRoleWithRelatedRoles(
  id: string
): Promise<RoleWithRelatedRoles | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLE_WITH_RELATED_ROLES,
      { id }
    );

    if (!result.records.length) {
      return null;
    }

    const record = result.records[0];

    const role: Role = {
      id:
        getStringValue(record.get("id")) ??
        "",
      name:
        getStringValue(record.get("name")) ??
        "",
      slug:
        getStringValue(record.get("slug")) ??
        "",
      category:
        getStringValue(
          record.get("category")
        ) ?? "",
      level: getStringValue(
        record.get("level")
      ),
      description: getStringValue(
        record.get("description")
      ),
      salaryRange: getStringValue(
        record.get("salaryRange")
      ),
    };

    const relatedRoles =
      (record.get("relatedRoles") as any[]) ??
      [];

    return {
      ...role,
      relatedRoles: relatedRoles
        .filter(Boolean)
        .map((relatedRole) => ({
          id:
            getStringValue(
              relatedRole.id
            ) ?? "",
          name:
            getStringValue(
              relatedRole.name
            ) ?? "",
          slug:
            getStringValue(
              relatedRole.slug
            ) ?? "",
          category:
            getStringValue(
              relatedRole.category
            ) ?? "",
          level:
            getStringValue(
              relatedRole.level
            ),
          description:
            getStringValue(
              relatedRole.description
            ),
          salaryRange:
            getStringValue(
              relatedRole.salaryRange
            ),
        })),
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
  slug?: string
): Promise<boolean> {
  if (!id && !slug) {
    return false;
  }

  const driver = getCognoDBDriver();

  const session = driver.session();

  try {
    const result = await session.run(
      ROLE_EXISTS,
      {
        id: id ?? "",
        slug: slug ?? "",
      }
    );

    return Boolean(
      result.records[0]?.get("exists")
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
    const result = await session.run(
      COUNT_ROLES
    );

    return Number(
      result.records[0]?.get("count") ?? 0
    );
  } finally {
    await session.close();
  }
}