// ============================================================
// ROLE QUERIES
// ============================================================

// ------------------------------------------------------------
// GET ALL ROLES
// ------------------------------------------------------------

export const GET_ALL_ROLES = `
  MATCH (r:Role)
  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
  ORDER BY r.name ASC
`;

// ------------------------------------------------------------
// GET ROLE BY ID
// ------------------------------------------------------------

export const GET_ROLE_BY_ID = `
  MATCH (r:Role {id: $id})
  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
  LIMIT 1
`;

// ------------------------------------------------------------
// GET ROLE BY SLUG
// ------------------------------------------------------------

export const GET_ROLE_BY_SLUG = `
  MATCH (r:Role {slug: $slug})
  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
  LIMIT 1
`;

// ------------------------------------------------------------
// SEARCH ROLES
// ------------------------------------------------------------

export const SEARCH_ROLES = `
  MATCH (r:Role)
  WHERE
    toLower(coalesce(r.name, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(r.slug, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(r.category, "")) CONTAINS toLower($search)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange

  ORDER BY r.name ASC
`;

// ------------------------------------------------------------
// GET ROLES BY CATEGORY
// ------------------------------------------------------------

export const GET_ROLES_BY_CATEGORY = `
  MATCH (r:Role {category: $category})
  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
  ORDER BY r.name ASC
`;

// ------------------------------------------------------------
// GET ROLES BY LEVEL
// ------------------------------------------------------------

export const GET_ROLES_BY_LEVEL = `
  MATCH (r:Role {level: $level})
  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
  ORDER BY r.name ASC
`;

// ------------------------------------------------------------
// CREATE ROLE
// ------------------------------------------------------------

export const CREATE_ROLE = `
  CREATE (r:Role {
    id: $id,
    name: $name,
    slug: $slug,
    category: $category,
    level: $level,
    description: $description,
    salaryRange: $salaryRange
  })

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
`;

// ------------------------------------------------------------
// UPDATE ROLE
// ------------------------------------------------------------

export const UPDATE_ROLE = `
  MATCH (r:Role {id: $id})

  SET
    r.name = $name,
    r.slug = $slug,
    r.category = $category,
    r.level = $level,
    r.description = $description,
    r.salaryRange = $salaryRange

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange
`;

// ------------------------------------------------------------
// DELETE ROLE
// ------------------------------------------------------------

export const DELETE_ROLE = `
  MATCH (r:Role {id: $id})

  DETACH DELETE r

  RETURN count(r) AS deleted
`;

// ------------------------------------------------------------
// GET ROLE REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLE_SKILLS = `
  MATCH (r:Role {id: $id})
  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
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
`;

// ------------------------------------------------------------
// GET ROLE WITH RELATED ROLES
// ------------------------------------------------------------
//
// Two roles are considered related when they share required
// skills.
// ------------------------------------------------------------

export const GET_ROLE_WITH_RELATED_ROLES = `
  MATCH (r:Role {id: $id})

  OPTIONAL MATCH (r)-[:REQUIRES]->(skill:Skill)
  OPTIONAL MATCH (related:Role)-[:REQUIRES]->(skill)

  WHERE related IS NULL OR related.id <> r.id

  WITH
    r,
    collect(DISTINCT related) AS relatedRoles

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.level AS level,
    r.description AS description,
    r.salaryRange AS salaryRange,
    [
      role IN relatedRoles
      WHERE role IS NOT NULL
      | {
          id: role.id,
          name: role.name,
          slug: role.slug,
          category: role.category,
          level: role.level,
          description: role.description,
          salaryRange: role.salaryRange
        }
    ] AS relatedRoles
`;

// ------------------------------------------------------------
// CHECK ROLE EXISTS
// ------------------------------------------------------------

export const ROLE_EXISTS = `
  MATCH (r:Role)
  WHERE r.id = $id OR r.slug = $slug
  RETURN count(r) > 0 AS exists
`;

// ------------------------------------------------------------
// COUNT ROLES
// ------------------------------------------------------------

export const COUNT_ROLES = `
  MATCH (r:Role)
  RETURN count(r) AS count
`;