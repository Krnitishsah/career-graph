// ============================================================
// GET ALL SKILLS
// ============================================================

export const GET_ALL_SKILLS = `
  MATCH (s:Skill)

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    collect(DISTINCT r.name) AS relatedRoleNames

  ORDER BY s.name ASC
`;

// ============================================================
// GET SKILL BY ID
// ============================================================

export const GET_SKILL_BY_ID = `
  MATCH (s:Skill {id: $id})

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    collect(DISTINCT r.name) AS relatedRoleNames
`;

// ============================================================
// GET SKILL BY SLUG
// ============================================================

export const GET_SKILL_BY_SLUG = `
  MATCH (s:Skill {slug: $slug})

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    collect(DISTINCT r.name) AS relatedRoleNames
`;

// ============================================================
// SEARCH SKILLS
// ============================================================

export const SEARCH_SKILLS = `
  MATCH (s:Skill)

  WHERE
    toLower(coalesce(s.name, "")) CONTAINS toLower($search)
    OR toLower(coalesce(s.category, "")) CONTAINS toLower($search)
    OR toLower(coalesce(s.description, "")) CONTAINS toLower($search)

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    collect(DISTINCT r.name) AS relatedRoleNames

  ORDER BY s.name ASC
`;

// ============================================================
// CREATE SKILL
// ============================================================

export const CREATE_SKILL = `
  CREATE (s:Skill {
    id: $id,
    name: $name,
    slug: $slug,
    category: $category,
    description: $description,
    level: $level
  })

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    [] AS relatedRoleNames
`;

// ============================================================
// UPDATE SKILL
// ============================================================

export const UPDATE_SKILL = `
  MATCH (s:Skill {id: $id})

  SET
    s.name = $name,
    s.slug = $slug,
    s.category = $category,
    s.description = $description,
    s.level = $level

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    collect(DISTINCT r.name) AS relatedRoleNames
`;

// ============================================================
// DELETE SKILL
// ============================================================

export const DELETE_SKILL = `
  MATCH (s:Skill {id: $id})
  DETACH DELETE s
`;

// ============================================================
// SKILL + RELATED SKILLS + RELATED ROLES
// ============================================================

export const GET_SKILL_WITH_RELATED_SKILLS = `
  MATCH (s:Skill {id: $id})

  OPTIONAL MATCH (s)-[:RELATED_TO]-(related:Skill)

  OPTIONAL MATCH (s)-[:REQUIRES]->(r:Role)

  WITH
    s,
    collect(
      DISTINCT CASE
        WHEN related IS NOT NULL THEN {
          id: related.id,
          name: related.name,
          slug: related.slug,
          category: related.category,
          description: related.description
        }
        ELSE null
      END
    ) AS rawRelatedSkills,
    collect(DISTINCT r.name) AS relatedRoleNames

  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    s.level AS level,
    s.proficiency AS proficiency,
    [skill IN rawRelatedSkills WHERE skill IS NOT NULL] AS relatedSkills,
    relatedRoleNames
`;