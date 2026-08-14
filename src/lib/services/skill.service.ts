// ============================================================
// SKILL SERVICE
// ============================================================

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
  RelatedSkill,
  Skill,
  SkillWithRelatedSkills,
} from "../../types/skill";

// ============================================================
// HELPERS
// ============================================================

function getStringValue(
  value: unknown
): string | undefined {
  if (
    value === null ||
    value === undefined
  ) {
    return undefined;
  }

  return String(value);
}

// ============================================================
// STRING ARRAY
// ============================================================

function getStringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string" &&
        item.trim().length > 0
    )
    .map((item) => item.trim());
}

// ============================================================
// MAP RELATED SKILL
// ============================================================

function mapRelatedSkill(
  value: unknown
): RelatedSkill | null {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const item =
    value as Record<string, unknown>;

  const id =
    getStringValue(item.id);

  const name =
    getStringValue(item.name);

  const slug =
    getStringValue(item.slug);

  const category =
    getStringValue(item.category);

  if (
    !id ||
    !name ||
    !slug ||
    !category
  ) {
    return null;
  }

  return {
    id,
    name,
    slug,
    category,
    description:
      getStringValue(
        item.description
      ),
  };
}

// ============================================================
// MAP SKILL RECORD
// ============================================================

function mapSkillRecord(
  record: any
): Skill {
  const relatedRoleNames =
    getStringArray(
      record.get("relatedRoleNames")
    );

  return {
    id:
      getStringValue(
        record.get("id")
      ) ?? "",

    name:
      getStringValue(
        record.get("name")
      ) ?? "",

    slug:
      getStringValue(
        record.get("slug")
      ) ?? "",

    category:
      getStringValue(
        record.get("category")
      ) ?? "",

    description:
      getStringValue(
        record.get("description")
      ),

    level:
      getStringValue(
        record.get("level")
      ) as Skill["level"] | undefined,

    proficiency:
      getStringValue(
        record.get("proficiency")
      ),

    relatedRoles:
      relatedRoleNames,

    relatedRoleNames:
      relatedRoleNames,

    relatedRoleCount:
      relatedRoleNames.length,
  };
}

// ============================================================
// GET ALL
// ============================================================

export async function getAllSkills(): Promise<
  Skill[]
> {
  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        GET_ALL_SKILLS
      );

    return result.records.map(
      mapSkillRecord
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET BY ID
// ============================================================

export async function getSkillById(
  id: string
): Promise<Skill | null> {
  if (!id?.trim()) {
    return null;
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        GET_SKILL_BY_ID,
        {
          id: id.trim(),
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
// GET BY SLUG
// ============================================================

export async function getSkillBySlug(
  slug: string
): Promise<Skill | null> {
  if (!slug?.trim()) {
    return null;
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        GET_SKILL_BY_SLUG,
        {
          slug: slug.trim(),
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
// SEARCH
// ============================================================

export async function searchSkills(
  search: string
): Promise<Skill[]> {
  if (!search?.trim()) {
    return getAllSkills();
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        SEARCH_SKILLS,
        {
          search: search.trim(),
        }
      );

    return result.records.map(
      mapSkillRecord
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// CREATE
// ============================================================

export async function createSkill(
  input: CreateSkillInput
): Promise<Skill> {
  if (!input.name?.trim()) {
    throw new Error(
      "Skill name is required"
    );
  }

  if (!input.slug?.trim()) {
    throw new Error(
      "Skill slug is required"
    );
  }

  if (!input.category?.trim()) {
    throw new Error(
      "Skill category is required"
    );
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const id =
      crypto.randomUUID();

    const result =
      await session.run(
        CREATE_SKILL,
        {
          id,

          name:
            input.name.trim(),

          slug:
            input.slug.trim(),

          category:
            input.category.trim(),

          description:
            input.description?.trim() ||
            null,

          level:
            input.level ?? null,
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
// UPDATE
// ============================================================

export async function updateSkill(
  id: string,
  input: CreateSkillInput
): Promise<Skill | null> {
  if (!id?.trim()) {
    return null;
  }

  if (!input.name?.trim()) {
    throw new Error(
      "Skill name is required"
    );
  }

  if (!input.slug?.trim()) {
    throw new Error(
      "Skill slug is required"
    );
  }

  if (!input.category?.trim()) {
    throw new Error(
      "Skill category is required"
    );
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        UPDATE_SKILL,
        {
          id: id.trim(),

          name:
            input.name.trim(),

          slug:
            input.slug.trim(),

          category:
            input.category.trim(),

          description:
            input.description?.trim() ||
            null,

          level:
            input.level ?? null,
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
// DELETE
// ============================================================

export async function deleteSkill(
  id: string
): Promise<boolean> {
  if (!id?.trim()) {
    return false;
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        DELETE_SKILL,
        {
          id: id.trim(),
        }
      );

    return (
      result.summary
        .counters
        .updates()
        .nodesDeleted > 0
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// RELATED SKILLS
// ============================================================

export async function getSkillWithRelatedSkills(
  id: string
): Promise<
  SkillWithRelatedSkills | null
> {
  if (!id?.trim()) {
    return null;
  }

  const driver =
    getCognoDBDriver();

  const session =
    driver.session();

  try {
    const result =
      await session.run(
        GET_SKILL_WITH_RELATED_SKILLS,
        {
          id: id.trim(),
        }
      );

    if (!result.records.length) {
      return null;
    }

    const record =
      result.records[0];

    const relatedRoleNames =
      getStringArray(
        record.get(
          "relatedRoleNames"
        )
      );

    const rawRelatedSkills =
      record.get(
        "relatedSkills"
      );

    const relatedSkills =
      Array.isArray(
        rawRelatedSkills
      )
        ? rawRelatedSkills
            .map(mapRelatedSkill)
            .filter(
              (
                item
              ): item is RelatedSkill =>
                item !== null
            )
        : [];

    return {
      id:
        getStringValue(
          record.get("id")
        ) ?? "",

      name:
        getStringValue(
          record.get("name")
        ) ?? "",

      slug:
        getStringValue(
          record.get("slug")
        ) ?? "",

      category:
        getStringValue(
          record.get("category")
        ) ?? "",

      description:
        getStringValue(
          record.get("description")
        ),

      level:
        getStringValue(
          record.get("level")
        ) as
          | Skill["level"]
          | undefined,

      proficiency:
        getStringValue(
          record.get("proficiency")
        ),

      relatedRoles:
        relatedRoleNames,

      relatedRoleNames:
        relatedRoleNames,

      relatedRoleCount:
        relatedRoleNames.length,

      relatedSkills,
    };
  } finally {
    await session.close();
  }
}