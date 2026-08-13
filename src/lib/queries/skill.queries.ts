// # skill.queries.ts

export const GET_ALL_SKILLS = `
  MATCH (s:Skill)
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
  ORDER BY s.name ASC
`;

export const GET_SKILL_BY_ID = `
  MATCH (s:Skill {id: $id})
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
`;

export const GET_SKILL_BY_SLUG = `
  MATCH (s:Skill {slug: $slug})
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
`;

export const SEARCH_SKILLS = `
  MATCH (s:Skill)
  WHERE
    toLower(s.name) CONTAINS toLower($search)
    OR toLower(s.category) CONTAINS toLower($search)
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
  ORDER BY s.name ASC
`;

export const CREATE_SKILL = `
  CREATE (s:Skill {
    id: $id,
    name: $name,
    slug: $slug,
    category: $category,
    description: $description
  })
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
`;

export const UPDATE_SKILL = `
  MATCH (s:Skill {id: $id})
  SET
    s.name = $name,
    s.slug = $slug,
    s.category = $category,
    s.description = $description
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description
`;

export const DELETE_SKILL = `
  MATCH (s:Skill {id: $id})
  DETACH DELETE s
`;

export const GET_SKILL_WITH_RELATED_SKILLS = `
  MATCH (s:Skill {id: $id})
  OPTIONAL MATCH (s)-[:RELATED_TO]-(related:Skill)
  RETURN
    s.id AS id,
    s.name AS name,
    s.slug AS slug,
    s.category AS category,
    s.description AS description,
    collect(
      CASE
        WHEN related IS NOT NULL THEN {
          id: related.id,
          name: related.name,
          slug: related.slug,
          category: related.category
        }
        ELSE NULL
      END
    ) AS relatedSkills
`;
