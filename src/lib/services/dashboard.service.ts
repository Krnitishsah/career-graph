import { getCognoDBSession } from "@/src/lib/cognodb";

import type { DashboardStats } from "@/src/types/dashboard";

/**
 * Get dashboard statistics from CognoDB.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const session = getCognoDBSession();

  try {
    const result = await session.run(`
      MATCH (role:Role)
      WITH count(role) AS roles

      MATCH (skill:Skill)
      WITH roles, count(skill) AS skills

      MATCH ()-[relationship]->()
      WITH roles, skills, count(relationship) AS relationships

      MATCH (node)
      UNWIND labels(node) AS label
      WITH roles, skills, relationships, collect(DISTINCT label) AS labels

      RETURN
        roles,
        skills,
        relationships,
        size(labels) AS categories
    `);

    if (!result.records.length) {
      return {
        roles: 0,
        skills: 0,
        relationships: 0,
        categories: 0,
      };
    }

    const record = result.records[0];

    return {
      roles: record.get("roles").toNumber(),
      skills: record.get("skills").toNumber(),
      relationships: record.get("relationships").toNumber(),
      categories: record.get("categories").toNumber(),
    };
  } finally {
    await session.close();
  }
}
