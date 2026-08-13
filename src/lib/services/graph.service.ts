// ============================================================
// GRAPH SERVICE
// ============================================================

import type { Node, Relationship } from "neo4j-driver";

import { getCognoDBDriver } from "../cognodb";

import {
  GET_GRAPH,
  GET_SKILL_GRAPH,
  GET_ROLE_GRAPH,
  SEARCH_GRAPH,
  GET_GRAPH_BY_CATEGORY,
  GET_GRAPH_BY_SKILLS,
  GET_ROLES_BY_SKILLS,
  GET_GRAPH_STATS,
} from "../queries/graph.queries";

import type { GraphNode, GraphRelationship } from "../../types/graph";

// ============================================================
// TYPES
// ============================================================

export interface RoleGraphResult {
  role: GraphNode;
  matchedSkills: GraphNode[];
  matchCount: number;
}

// ============================================================
// HELPERS
// ============================================================

function mapNode(node: Node): GraphNode {
  return {
    id: String(node.properties.id),

    label: String(node.labels?.[0] ?? "Node"),

    properties: Object.fromEntries(
      Object.entries(node.properties).map(([key, value]) => [
        key,
        value?.toString?.() ?? value,
      ]),
    ),
  };
}

function mapRelationship(relationship: Relationship): GraphRelationship {
  return {
    id: String(relationship.elementId),

    type: relationship.type,

    source: String(relationship.startNodeElementId),

    target: String(relationship.endNodeElementId),

    properties: Object.fromEntries(
      Object.entries(relationship.properties).map(([key, value]) => [
        key,
        value?.toString?.() ?? value,
      ]),
    ),
  };
}

// ============================================================
// COMPLETE GRAPH
// ============================================================

export async function getGraph(limit = 100) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(GET_GRAPH, { limit });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const source = record.get("source") as Node;

      const target = record.get("target") as Node;

      const relationship = record.get("relationship") as Relationship;

      if (source) {
        const node = mapNode(source);
        nodes.set(node.id, node);
      }

      if (target) {
        const node = mapNode(target);
        nodes.set(node.id, node);
      }

      if (relationship) {
        const relation = mapRelationship(relationship);

        relationships.set(relation.id, relation);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// SKILL GRAPH
// ============================================================

export async function getSkillGraph(limit = 50) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(GET_SKILL_GRAPH, { limit });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const skill = record.get("s") as Node;

      if (skill) {
        const node = mapNode(skill);

        nodes.set(node.id, node);
      }

      const connectedNodes =
        (record.get("connectedNodes") as Node[] | null) ?? [];

      for (const connected of connectedNodes) {
        if (!connected) continue;

        const node = mapNode(connected);

        nodes.set(node.id, node);
      }

      const relationList =
        (record.get("relationships") as Relationship[] | null) ?? [];

      for (const relation of relationList) {
        if (!relation) continue;

        const mapped = mapRelationship(relation);

        relationships.set(mapped.id, mapped);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// ROLE GRAPH
// ============================================================

export async function getRoleGraph(limit = 50) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(GET_ROLE_GRAPH, { limit });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const role = record.get("r") as Node;

      if (role) {
        const node = mapNode(role);

        nodes.set(node.id, node);
      }

      const connectedNodes =
        (record.get("connectedNodes") as Node[] | null) ?? [];

      for (const connected of connectedNodes) {
        if (!connected) continue;

        const node = mapNode(connected);

        nodes.set(node.id, node);
      }

      const relationList =
        (record.get("relationships") as Relationship[] | null) ?? [];

      for (const relation of relationList) {
        if (!relation) continue;

        const mapped = mapRelationship(relation);

        relationships.set(mapped.id, mapped);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// SEARCH GRAPH
// ============================================================

export async function searchGraph(search: string, limit = 50) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(SEARCH_GRAPH, {
      search,
      limit,
    });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const node = record.get("node") as Node;

      if (node) {
        const mapped = mapNode(node);

        nodes.set(mapped.id, mapped);
      }

      const connectedNodes =
        (record.get("connectedNodes") as Node[] | null) ?? [];

      for (const connected of connectedNodes) {
        if (!connected) continue;

        const mapped = mapNode(connected);

        nodes.set(mapped.id, mapped);
      }

      const relationList =
        (record.get("relationships") as Relationship[] | null) ?? [];

      for (const relation of relationList) {
        if (!relation) continue;

        const mapped = mapRelationship(relation);

        relationships.set(mapped.id, mapped);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// GRAPH BY CATEGORY
// ============================================================

export async function getGraphByCategory(category: string, limit = 50) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(GET_GRAPH_BY_CATEGORY, {
      category,
      limit,
    });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const node = record.get("node") as Node;

      if (node) {
        const mapped = mapNode(node);

        nodes.set(mapped.id, mapped);
      }

      const connectedNodes =
        (record.get("connectedNodes") as Node[] | null) ?? [];

      for (const connected of connectedNodes) {
        if (!connected) continue;

        const mapped = mapNode(connected);

        nodes.set(mapped.id, mapped);
      }

      const relationList =
        (record.get("relationships") as Relationship[] | null) ?? [];

      for (const relation of relationList) {
        if (!relation) continue;

        const mapped = mapRelationship(relation);

        relationships.set(mapped.id, mapped);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// GRAPH FOR SELECTED SKILLS
// ============================================================

export async function getGraphBySkills(skillSlugs: string[]) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const cleanSlugs = skillSlugs
      .map((slug) => slug.trim().toLowerCase())
      .filter(Boolean);

    if (!cleanSlugs.length) {
      return {
        nodes: [],
        relationships: [],
      };
    }

    const result = await session.run(GET_GRAPH_BY_SKILLS, {
      skillSlugs: cleanSlugs,
    });

    const nodes = new Map<string, GraphNode>();

    const relationships = new Map<string, GraphRelationship>();

    for (const record of result.records) {
      const skill = record.get("s") as Node;

      if (skill) {
        const mapped = mapNode(skill);

        nodes.set(mapped.id, mapped);
      }

      const connectedNodes =
        (record.get("connectedNodes") as Node[] | null) ?? [];

      for (const connected of connectedNodes) {
        if (!connected) continue;

        const mapped = mapNode(connected);

        nodes.set(mapped.id, mapped);
      }

      const relationList =
        (record.get("relationships") as Relationship[] | null) ?? [];

      for (const relation of relationList) {
        if (!relation) continue;

        const mapped = mapRelationship(relation);

        relationships.set(mapped.id, mapped);
      }
    }

    return {
      nodes: Array.from(nodes.values()),

      relationships: Array.from(relationships.values()),
    };
  } finally {
    await session.close();
  }
}

// ============================================================
// ROLES BY SELECTED SKILLS
// ============================================================

export async function getRolesBySkills(skillSlugs: string[], limit = 50) {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const cleanSlugs = skillSlugs
      .map((slug) => slug.trim().toLowerCase())
      .filter(Boolean);

    if (!cleanSlugs.length) {
      return [];
    }

    const result = await session.run(GET_ROLES_BY_SKILLS, {
      skillSlugs: cleanSlugs,
      limit,
    });

    return result.records.map((record) => {
      const role = record.get("r") as Node;

      const matchedSkills =
        (record.get("matchedSkills") as Node[] | null) ?? [];

      return {
        role: mapNode(role),

        matchedSkills: matchedSkills.filter(Boolean).map(mapNode),

        matchCount: Number(record.get("matchCount")),
      };
    });
  } finally {
    await session.close();
  }
}

// ============================================================
// GRAPH STATS
// ============================================================

export async function getGraphStats() {
  const driver = getCognoDBDriver();
  const session = driver.session();

  try {
    const result = await session.run(GET_GRAPH_STATS);

    if (!result.records.length) {
      return {
        skillCount: 0,
        roleCount: 0,
        relationshipCount: 0,
      };
    }

    const record = result.records[0];

    return {
      skillCount: Number(record.get("skillCount")),

      roleCount: Number(record.get("roleCount")),

      relationshipCount: Number(record.get("relationshipCount")),
    };
  } finally {
    await session.close();
  }
}
