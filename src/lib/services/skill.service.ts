// ============================================================
// SKILL SERVICE
// ============================================================

import type { Node } from "neo4j-driver";

import { getCognoDBDriver } from "../cognodb";

import {
  CREATE_SKILL,
  DELETE_SKILL,
  GET_ALL_SKILLS,
  GET_SKILL_BY_ID,
  GET_SKILL_BY_SLUG,
  GET_SKILL_WITH_RELATED_SKILLS,
  SEARCH_SKILLS,
  UPDATE_SKILL,
} from "../queries/skill.queries";

import type {
  CreateSkillInput,
  Skill,
} from "../../types/skill";

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

function mapSkillRecord(record: any): Skill {
  return {
    id: getStringValue(record.get("id")) ?? "",
    name: getStringValue(record.get("name")) ?? "",
    slug: getStringValue(record.get("slug")) ?? "",
    category:
      getStringValue(record.get("category")) ?? "",
    description: getStringValue(
      record.get("description")
    ),
  };
}

function mapSkillNode(node: Node): Skill {
  return {
    id: getStringValue(node.properties.id) ?? "",
    name:
      getStringValue(node.properties.name) ?? "",
    slug:
      getStringValue(node.properties.slug) ?? "",
    category:
      getStringValue(node.properties.category) ?? "",
    description: getStringValue(
      node.properties.description
    ),
  };
}

// ============================================================
// GET ALL SKILLS
// ============================================================

export async function getAllSkills(): Promise<Skill[]> {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_ALL_SKILLS
    );

    return result.records.map(mapSkillRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET SKILL BY ID
// ============================================================

export async function getSkillById(
  id: string
): Promise<Skill | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_SKILL_BY_ID,
      { id }
    );

    if (!result.records.length) {
      return null;
    }

    return mapSkillRecord(result.records[0]);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET SKILL BY SLUG
// ============================================================

export async function getSkillBySlug(
  slug: string
): Promise<Skill | null> {
  if (!slug) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_SKILL_BY_SLUG,
      { slug }
    );

    if (!result.records.length) {
      return null;
    }

    return mapSkillRecord(result.records[0]);
  } finally {
    await session.close();
  }
}

// ============================================================
// SEARCH SKILLS
// ============================================================

export async function searchSkills(
  search: string
): Promise<Skill[]> {
  if (!search?.trim()) {
    return getAllSkills();
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      SEARCH_SKILLS,
      {
        search: search.trim(),
      }
    );

    return result.records.map(mapSkillRecord);
  } finally {
    await session.close();
  }
}

// ============================================================
// CREATE SKILL
// ============================================================

export async function createSkill(
  input: CreateSkillInput
): Promise<Skill> {
  if (!input.name) {
    throw new Error("Skill name is required");
  }

  if (!input.slug) {
    throw new Error("Skill slug is required");
  }

  if (!input.category) {
    throw new Error("Skill category is required");
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const id = crypto.randomUUID();

    const result = await session.run(
      CREATE_SKILL,
      {
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        description:
          input.description ?? null,
      }
    );

    if (!result.records.length) {
      throw new Error(
        "Failed to create skill"
      );
    }

    return mapSkillRecord(
      result.records[0]
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// UPDATE SKILL
// ============================================================

export async function updateSkill(
  id: string,
  input: CreateSkillInput
): Promise<Skill | null> {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      UPDATE_SKILL,
      {
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        description:
          input.description ?? null,
      }
    );

    if (!result.records.length) {
      return null;
    }

    return mapSkillRecord(
      result.records[0]
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// DELETE SKILL
// ============================================================

export async function deleteSkill(
  id: string
): Promise<boolean> {
  if (!id) {
    return false;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      DELETE_SKILL,
      { id }
    );

    return (
      result.summary.counters.updates()
        .nodesDeleted > 0
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET SKILL WITH RELATED SKILLS
// ============================================================

export async function getSkillWithRelatedSkills(
  id: string
) {
  if (!id) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_SKILL_WITH_RELATED_SKILLS,
      { id }
    );

    if (!result.records.length) {
      return null;
    }

    const record = result.records[0];

    const relatedSkills =
      (record.get("relatedSkills") as Node[] | null) ??
      [];

    return {
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
      description: getStringValue(
        record.get("description")
      ),
      relatedSkills: relatedSkills
        .filter(Boolean)
        .map(mapSkillNode),
    };
  } finally {
    await session.close();
  }
}