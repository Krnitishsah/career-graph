// ============================================================
// ROLE QUERIES
// ============================================================

// ------------------------------------------------------------
// GET ALL ROLES WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ALL_ROLES = `
  MATCH (r:Role)

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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
`;

// ------------------------------------------------------------
// GET ROLE BY ID WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLE_BY_ID = `
  MATCH (r:Role {id: $id})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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

  LIMIT 1
`;

// ------------------------------------------------------------
// GET ROLE BY SLUG WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLE_BY_SLUG = `
  MATCH (r:Role {slug: $slug})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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

  LIMIT 1
`;

// ------------------------------------------------------------
// SEARCH ROLES WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const SEARCH_ROLES = `
  MATCH (r:Role)

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  WITH
    r,
    collect(
      DISTINCT CASE
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

  WHERE
    toLower(coalesce(r.name, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(r.slug, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(r.category, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(r.experienceLevel, "")) CONTAINS toLower($search)
    OR
    any(
      skill IN skills
      WHERE
        skill IS NOT NULL
        AND (
          toLower(coalesce(skill.name, "")) CONTAINS toLower($search)
          OR
          toLower(coalesce(skill.slug, "")) CONTAINS toLower($search)
          OR
          toLower(coalesce(skill.category, "")) CONTAINS toLower($search)
        )
    )

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,
    skills AS skills

  ORDER BY r.name ASC
`;

// ------------------------------------------------------------
// GET ROLES BY CATEGORY WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLES_BY_CATEGORY = `
  MATCH (r:Role {category: $category})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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
`;

// ------------------------------------------------------------
// GET ROLES BY EXPERIENCE LEVEL WITH REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLES_BY_LEVEL = `
  MATCH (r:Role {experienceLevel: $experienceLevel})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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
    experienceLevel: $experienceLevel,
    description: $description,
    salaryRange: $salaryRange
  })

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,
    [] AS skills
`;

// ------------------------------------------------------------
// UPDATE ROLE
// ------------------------------------------------------------

export const UPDATE_ROLE = `
  MATCH (r:Role {id: $id})

  SET
    r.name = coalesce($name, r.name),
    r.slug = coalesce($slug, r.slug),
    r.category = coalesce($category, r.category),
    r.experienceLevel = coalesce(
      $experienceLevel,
      r.experienceLevel
    ),
    r.description = coalesce(
      $description,
      r.description
    ),
    r.salaryRange = coalesce(
      $salaryRange,
      r.salaryRange
    )

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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
// DELETE ROLE
// ------------------------------------------------------------

export const DELETE_ROLE = `
  MATCH (r:Role {id: $id})

  WITH r

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
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    collect(
      DISTINCT CASE
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

export const GET_ROLE_WITH_RELATED_ROLES = `
  MATCH (r:Role {id: $id})

  OPTIONAL MATCH (r)-[:REQUIRES]->(skill:Skill)

  OPTIONAL MATCH (related:Role)-[:REQUIRES]->(skill)

  WHERE
    related IS NULL
    OR related.id <> r.id

  WITH
    r,
    collect(DISTINCT related) AS relatedRoles

  RETURN
    r.id AS id,
    r.name AS name,
    r.slug AS slug,
    r.category AS category,
    r.experienceLevel AS experienceLevel,
    r.description AS description,
    r.salaryRange AS salaryRange,

    [
      role IN relatedRoles
      WHERE role IS NOT NULL
      |
      {
        id: role.id,
        name: role.name,
        slug: role.slug,
        category: role.category,
        experienceLevel: role.experienceLevel,
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

  WHERE
    ($id <> "" AND r.id = $id)
    OR
    ($slug <> "" AND r.slug = $slug)

  RETURN count(r) > 0 AS exists
`;

// ------------------------------------------------------------
// COUNT ROLES
// ------------------------------------------------------------

export const COUNT_ROLES = `
  MATCH (r:Role)

  RETURN count(r) AS count
`;
