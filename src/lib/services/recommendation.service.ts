// ============================================================
// RECOMMENDATION SERVICE
// ============================================================

import type { Node } from "neo4j-driver";

import { getCognoDBDriver } from "../cognodb";

import {
  GET_CAREER_RECOMMENDATIONS,
  GET_TOP_CAREER_RECOMMENDATIONS,
  GET_RECOMMENDATIONS_BY_CATEGORY,
  GET_ROLE_MATCH_DETAILS,
  GET_MISSING_SKILLS_FOR_ROLE,
  GET_BEST_NEXT_SKILLS,
  GET_RECOMMENDATIONS_WITH_ADDITIONAL_SKILL,
} from "../queries/recommendation.queries";

import type {
  CareerRecommendation,
  GraphNode,
} from "../../types/recommendation";

// ============================================================
// TYPES
// ============================================================

export interface RecommendationOptions {
  skillIds?: string[];
  skillSlugs?: string[];
  roleId?: string;
  limit?: number;
  minScore?: number;
}

export interface RoleRecommendationOptions {
  skillIds?: string[];
  skillSlugs?: string[];
  limit?: number;
  minScore?: number;
}

export interface SkillRecommendationOptions {
  skillIds?: string[];
  skillSlugs?: string[];
  roleId?: string;
  limit?: number;
}

// ============================================================
// HELPERS
// ============================================================

function normalizeSkillSlugs(
  skillSlugs: string[] = []
): string[] {
  return Array.from(
    new Set(
      skillSlugs
        .map((skill) => skill?.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}

function normalizeLimit(limit = 10): number {
  const value = Number(limit);

  if (!Number.isFinite(value)) {
    return 10;
  }

  return Math.min(
    Math.max(Math.floor(value), 1),
    50
  );
}

function normalizeMinScore(minScore = 0): number {
  const value = Number(minScore);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(
    Math.max(value, 0),
    100
  );
}

function normalizeRoleId(
  roleId?: string
): string | undefined {
  const value = roleId?.trim();

  return value || undefined;
}

function mapNode(node: Node): GraphNode {
  if (!node) {
    throw new Error("Cannot map empty graph node");
  }

  return {
    id: String(node.properties?.id ?? ""),
    label: String(
      node.labels?.[0] ?? "Node"
    ),
    properties: Object.fromEntries(
      Object.entries(node.properties ?? {}).map(
        ([key, value]) => [
          key,
          value?.toString?.() ?? value,
        ]
      )
    ),
  };
}

function mapCareerRecommendation(
  record: any
): CareerRecommendation {
  const requiredSkills =
    (record.get(
      "requiredSkills"
    ) as Node[] | null) ?? [];

  const matchedSkills =
    (record.get(
      "matchedSkills"
    ) as Node[] | null) ?? [];

  return {
    role: mapNode(
      record.get("role") as Node
    ),

    requiredSkills:
      requiredSkills
        .filter(Boolean)
        .map(mapNode),

    matchedSkills:
      matchedSkills
        .filter(Boolean)
        .map(mapNode),

    matchScore: Number(
      record.get("matchScore") ?? 0
    ),
  };
}

// ============================================================
// GET CAREER RECOMMENDATIONS
// ============================================================

export async function getCareerRecommendations(
  skillSlugs: string[],
  limit = 10
): Promise<CareerRecommendation[]> {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedSkills.length) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_CAREER_RECOMMENDATIONS,
      {
        skillSlugs: normalizedSkills,
        limit: normalizeLimit(limit),
      }
    );

    return result.records.map(
      mapCareerRecommendation
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET TOP CAREER RECOMMENDATIONS
// ============================================================

export async function getTopCareerRecommendations(
  skillSlugs: string[],
  limit = 5
): Promise<CareerRecommendation[]> {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedSkills.length) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_TOP_CAREER_RECOMMENDATIONS,
      {
        skillSlugs: normalizedSkills,
        limit: normalizeLimit(limit),
      }
    );

    return result.records.map(
      mapCareerRecommendation
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET RECOMMENDATIONS BY CATEGORY
// ============================================================

export async function getRecommendationsByCategory(
  skillSlugs: string[],
  category: string,
  limit = 10
): Promise<CareerRecommendation[]> {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  const normalizedCategory =
    category?.trim();

  if (
    !normalizedSkills.length ||
    !normalizedCategory
  ) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_RECOMMENDATIONS_BY_CATEGORY,
      {
        skillSlugs: normalizedSkills,
        category: normalizedCategory,
        limit: normalizeLimit(limit),
      }
    );

    return result.records.map(
      mapCareerRecommendation
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET ROLE MATCH DETAILS
// ============================================================

export async function getRoleMatchDetails(
  roleId: string,
  skillSlugs: string[]
): Promise<CareerRecommendation | null> {
  const normalizedRoleId =
    normalizeRoleId(roleId);

  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedRoleId) {
    return null;
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_ROLE_MATCH_DETAILS,
      {
        roleId: normalizedRoleId,
        skillSlugs: normalizedSkills,
      }
    );

    if (!result.records.length) {
      return null;
    }

    return mapCareerRecommendation(
      result.records[0]
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// GET MISSING SKILLS
// ============================================================

export async function getMissingSkillsForRole(
  roleId: string,
  skillSlugs: string[]
): Promise<GraphNode[]> {
  const normalizedRoleId =
    normalizeRoleId(roleId);

  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedRoleId) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_MISSING_SKILLS_FOR_ROLE,
      {
        roleId: normalizedRoleId,
        skillSlugs: normalizedSkills,
      }
    );

    return result.records
      .map(
        (record) =>
          record.get("skill") as Node
      )
      .filter(Boolean)
      .map(mapNode);
  } finally {
    await session.close();
  }
}

// ============================================================
// GET BEST NEXT SKILLS
// ============================================================

export async function getBestNextSkills(
  skillSlugs: string[],
  limit = 5
) {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedSkills.length) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_BEST_NEXT_SKILLS,
      {
        skillSlugs: normalizedSkills,
        limit: normalizeLimit(limit),
      }
    );

    return result.records.map(
      (record) => ({
        skill: mapNode(
          record.get(
            "requiredSkill"
          ) as Node
        ),

        roleCount: Number(
          record.get("roleCount") ?? 0
        ),
      })
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// SIMULATE ADDING A SKILL
// ============================================================

export async function getRecommendationsWithAdditionalSkill(
  skillSlugs: string[],
  additionalSkillSlug: string,
  limit = 10
): Promise<CareerRecommendation[]> {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  const normalizedAdditionalSkill =
    additionalSkillSlug
      ?.trim()
      .toLowerCase();

  if (!normalizedAdditionalSkill) {
    return [];
  }

  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(
      GET_RECOMMENDATIONS_WITH_ADDITIONAL_SKILL,
      {
        skillSlugs: normalizedSkills,
        additionalSkillSlug:
          normalizedAdditionalSkill,
        limit: normalizeLimit(limit),
      }
    );

    return result.records.map(
      mapCareerRecommendation
    );
  } finally {
    await session.close();
  }
}

// ============================================================
// PUBLIC API: GET RECOMMENDATIONS
// ============================================================

export async function getRecommendations(
  options: RecommendationOptions = {}
): Promise<CareerRecommendation[]> {
  const {
    skillIds = [],
    skillSlugs = [],
    roleId,
    limit = 10,
    minScore = 0,
  } = options;

  /*
   * IMPORTANT
   *
   * Current recommendation Cypher queries use
   * Skill.slug, not Skill.id.
   *
   * Therefore:
   *
   * skillSlugs -> supported directly
   *
   * skillIds -> only supported if they actually
   * contain slugs.
   *
   * If skillIds are UUIDs, create a lookup:
   * Skill.id -> Skill.slug
   */

  const normalizedSkillSlugs =
    normalizeSkillSlugs(
      skillSlugs.length
        ? skillSlugs
        : skillIds
    );

  if (!normalizedSkillSlugs.length) {
    return [];
  }

  const normalizedRoleId =
    normalizeRoleId(roleId);

  let recommendations: CareerRecommendation[];

  if (normalizedRoleId) {
    const result =
      await getRoleMatchDetails(
        normalizedRoleId,
        normalizedSkillSlugs
      );

    recommendations =
      result ? [result] : [];
  } else {
    recommendations =
      await getCareerRecommendations(
        normalizedSkillSlugs,
        limit
      );
  }

  const minimumScore =
    normalizeMinScore(minScore);

  return recommendations.filter(
    (item) =>
      item.matchScore >= minimumScore
  );
}

// ============================================================
// PUBLIC API: ROLE RECOMMENDATIONS
// ============================================================

export async function getRoleRecommendations(
  options: RoleRecommendationOptions = {}
): Promise<CareerRecommendation[]> {
  const {
    skillIds = [],
    skillSlugs = [],
    limit = 10,
    minScore = 0,
  } = options;

  const normalizedSkillSlugs =
    normalizeSkillSlugs(
      skillSlugs.length
        ? skillSlugs
        : skillIds
    );

  if (!normalizedSkillSlugs.length) {
    return [];
  }

  const recommendations =
    await getCareerRecommendations(
      normalizedSkillSlugs,
      limit
    );

  const minimumScore =
    normalizeMinScore(minScore);

  return recommendations.filter(
    (item) =>
      item.matchScore >= minimumScore
  );
}

// ============================================================
// PUBLIC API: SKILL RECOMMENDATIONS
// ============================================================

export async function getSkillRecommendations(
  options: SkillRecommendationOptions = {}
) {
  const {
    skillIds = [],
    skillSlugs = [],
    roleId,
    limit = 10,
  } = options;

  const normalizedSkillSlugs =
    normalizeSkillSlugs(
      skillSlugs.length
        ? skillSlugs
        : skillIds
    );

  const normalizedRoleId =
    normalizeRoleId(roleId);

  // ----------------------------------------------------------
  // ROLE PROVIDED
  // ----------------------------------------------------------

  if (normalizedRoleId) {
    return getMissingSkillsForRole(
      normalizedRoleId,
      normalizedSkillSlugs
    );
  }

  // ----------------------------------------------------------
  // NO ROLE -> BEST NEXT SKILLS
  // ----------------------------------------------------------

  if (!normalizedSkillSlugs.length) {
    return [];
  }

  return getBestNextSkills(
    normalizedSkillSlugs,
    limit
  );
}

// ============================================================
// GET RECOMMENDATION SUMMARY
// ============================================================

export async function getRecommendationSummary(
  skillSlugs: string[]
) {
  const normalizedSkills =
    normalizeSkillSlugs(skillSlugs);

  if (!normalizedSkills.length) {
    return {
      recommendations: [],
      nextSkills: [],
      totalRecommendations: 0,
    };
  }

  const [
    recommendations,
    nextSkills,
  ] = await Promise.all([
    getTopCareerRecommendations(
      normalizedSkills,
      5
    ),

    getBestNextSkills(
      normalizedSkills,
      5
    ),
  ]);

  return {
    recommendations,
    nextSkills,
    totalRecommendations:
      recommendations.length,
  };
}
