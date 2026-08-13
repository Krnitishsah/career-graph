// ============================================================
// GRAPH QUERIES
// ============================================================

// ------------------------------------------------------------
// GET COMPLETE GRAPH
// ------------------------------------------------------------

export const GET_GRAPH = `
  MATCH (source)-[relationship]->(target)

  RETURN
    source,
    relationship,
    target

  LIMIT $limit
`;

// ------------------------------------------------------------
// GET SKILL GRAPH
// ------------------------------------------------------------

export const GET_SKILL_GRAPH = `
  MATCH (s:Skill)

  OPTIONAL MATCH (s)-[r]-(connected)

  WITH
    s,
    collect(DISTINCT r) AS relationships,
    collect(DISTINCT connected) AS connectedNodes

  RETURN
    s,
    relationships,
    connectedNodes

  LIMIT $limit
`;

// ------------------------------------------------------------
// GET ROLE GRAPH
// ------------------------------------------------------------

export const GET_ROLE_GRAPH = `
  MATCH (r:Role)

  OPTIONAL MATCH (r)-[rel]-(connected)

  WITH
    r,
    collect(DISTINCT rel) AS relationships,
    collect(DISTINCT connected) AS connectedNodes

  RETURN
    r,
    relationships,
    connectedNodes

  LIMIT $limit
`;

// ------------------------------------------------------------
// GET SKILL RELATIONSHIPS
// ------------------------------------------------------------

export const GET_SKILL_RELATIONSHIPS = `
  MATCH (s:Skill {id: $id})

  OPTIONAL MATCH (s)-[r:RELATED_TO]-(related:Skill)

  RETURN
    s,
    collect(DISTINCT r) AS relationships,
    collect(DISTINCT related) AS relatedSkills
`;

// ------------------------------------------------------------
// GET ROLE REQUIRED SKILLS
// ------------------------------------------------------------

export const GET_ROLE_REQUIRED_SKILLS = `
  MATCH (r:Role {id: $roleId})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r,
    collect(DISTINCT s) AS skills
`;

// ------------------------------------------------------------
// GET ROLE REQUIRED SKILLS BY SLUG
// ------------------------------------------------------------

export const GET_ROLE_REQUIRED_SKILLS_BY_SLUG = `
  MATCH (r:Role {slug: $slug})

  OPTIONAL MATCH (r)-[:REQUIRES]->(s:Skill)

  RETURN
    r,
    collect(DISTINCT s) AS skills
`;

// ------------------------------------------------------------
// GET ROLES BY SKILL
// ------------------------------------------------------------

export const GET_ROLES_BY_SKILL = `
  MATCH (s:Skill {id: $skillId})

  MATCH (r:Role)-[:REQUIRES]->(s)

  RETURN DISTINCT r

  ORDER BY r.name
`;

// ------------------------------------------------------------
// GET ROLES BY SKILL SLUG
// ------------------------------------------------------------

export const GET_ROLES_BY_SKILL_SLUG = `
  MATCH (s:Skill {slug: $slug})

  MATCH (r:Role)-[:REQUIRES]->(s)

  RETURN DISTINCT r

  ORDER BY r.name
`;

// ------------------------------------------------------------
// GET RELATED ROLES
// ------------------------------------------------------------

export const GET_RELATED_ROLES = `
  MATCH (r:Role {id: $roleId})

  MATCH (r)-[:REQUIRES]->(skill:Skill)

  MATCH (related:Role)-[:REQUIRES]->(skill)

  WHERE related.id <> r.id

  WITH
    related,
    count(DISTINCT skill) AS sharedSkills

  RETURN
    related,
    sharedSkills

  ORDER BY
    sharedSkills DESC,
    related.name ASC

  LIMIT $limit
`;

// ------------------------------------------------------------
// GET RELATED SKILLS
// ------------------------------------------------------------

export const GET_RELATED_SKILLS = `
  MATCH (s:Skill {id: $skillId})

  MATCH (s)-[:RELATED_TO]-(related:Skill)

  RETURN DISTINCT related

  ORDER BY related.name

  LIMIT $limit
`;

// ------------------------------------------------------------
// SEARCH GRAPH
// ------------------------------------------------------------

export const SEARCH_GRAPH = `
  MATCH (node)

  WHERE
    toLower(coalesce(node.name, "")) CONTAINS toLower($search)
    OR
    toLower(coalesce(node.slug, "")) CONTAINS toLower($search)

  OPTIONAL MATCH (node)-[relationship]-(connected)

  WITH
    node,
    collect(DISTINCT relationship) AS relationships,
    collect(DISTINCT connected) AS connectedNodes

  RETURN
    node,
    relationships,
    connectedNodes

  LIMIT $limit
`;

// ------------------------------------------------------------
// GRAPH BY CATEGORY
// ------------------------------------------------------------

export const GET_GRAPH_BY_CATEGORY = `
  MATCH (node)

  WHERE
    toLower(coalesce(node.category, "")) =
    toLower($category)

  OPTIONAL MATCH (node)-[relationship]-(connected)

  WITH
    node,
    collect(DISTINCT relationship) AS relationships,
    collect(DISTINCT connected) AS connectedNodes

  RETURN
    node,
    relationships,
    connectedNodes

  LIMIT $limit
`;

// ============================================================
// SELECTED SKILLS GRAPH
// ============================================================

// ------------------------------------------------------------
// GET GRAPH FOR SELECTED SKILLS
// ------------------------------------------------------------

export const GET_GRAPH_BY_SKILLS = `
  MATCH (s:Skill)

  WHERE s.slug IN $skillSlugs

  OPTIONAL MATCH (s)-[relationship]-(connected)

  WITH
    s,
    collect(DISTINCT relationship) AS relationships,
    collect(DISTINCT connected) AS connectedNodes

  RETURN
    s,
    relationships,
    connectedNodes
`;

// ------------------------------------------------------------
// GET ROLES FOR SELECTED SKILLS
// ------------------------------------------------------------

export const GET_ROLES_BY_SKILLS = `
  MATCH (s:Skill)

  WHERE s.slug IN $skillSlugs

  MATCH (r:Role)-[:REQUIRES]->(s)

  WITH
    r,
    collect(DISTINCT s) AS matchedSkills,
    count(DISTINCT s) AS matchCount

  RETURN
    r,
    matchedSkills,
    matchCount

  ORDER BY
    matchCount DESC,
    r.name ASC

  LIMIT $limit
`;

// ------------------------------------------------------------
// ROLE MATCH DETAILS
// ------------------------------------------------------------

export const GET_ROLE_MATCH_DETAILS = `
  MATCH (r:Role)

  OPTIONAL MATCH (r)-[:REQUIRES]->(required:Skill)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills

  WITH
    r,
    requiredSkills,
    [
      skill IN requiredSkills
      WHERE skill.slug IN $skillSlugs
    ] AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    [
      skill IN requiredSkills
      WHERE NOT skill.slug IN $skillSlugs
    ] AS missingSkills

  RETURN
    r,
    requiredSkills,
    matchedSkills,
    missingSkills,
    size(matchedSkills) AS matchCount,
    size(requiredSkills) AS requiredCount

  ORDER BY
    matchCount DESC,
    r.name ASC

  LIMIT $limit
`;

// ------------------------------------------------------------
// SELECTED SKILLS + ROLE GRAPH
// ------------------------------------------------------------
//
// This query is useful for the Explore Graph page.
// It returns:
//
// - selected skills
// - matching roles
// - required skills
// - missing skills
// - relationships between them
//
// ------------------------------------------------------------

export const GET_CAREER_GRAPH = `
  MATCH (selected:Skill)

  WHERE selected.slug IN $skillSlugs

  OPTIONAL MATCH (role:Role)-[:REQUIRES]->(selected)

  WITH
    collect(DISTINCT selected) AS selectedSkills,
    collect(DISTINCT role) AS matchedRoles

  UNWIND matchedRoles AS r

  OPTIONAL MATCH (r)-[:REQUIRES]->(required:Skill)

  WITH
    selectedSkills,
    r,
    collect(DISTINCT required) AS requiredSkills

  WITH
    selectedSkills,
    r,
    requiredSkills,
    [
      skill IN requiredSkills
      WHERE skill.slug IN $skillSlugs
    ] AS matchedSkills,
    [
      skill IN requiredSkills
      WHERE NOT skill.slug IN $skillSlugs
    ] AS missingSkills

  RETURN
    selectedSkills,
    r AS role,
    requiredSkills,
    matchedSkills,
    missingSkills,
    size(matchedSkills) AS matchCount,
    size(requiredSkills) AS requiredCount

  ORDER BY
    matchCount DESC,
    r.name ASC

  LIMIT $limit
`;

// ------------------------------------------------------------
// GRAPH FOR SELECTED SKILLS + RELATIONSHIP FILTER
// ------------------------------------------------------------
//
// relationship:
//
// ""           = all
// "REQUIRES"   = role requires skill
// "RELATED_TO" = skill related to skill
//
// ------------------------------------------------------------

export const GET_SELECTED_SKILLS_RELATIONSHIPS = `
  MATCH (source)-[relationship]-(target)

  WHERE
    (
      source:Skill
      AND source.slug IN $skillSlugs
    )
    OR
    (
      target:Skill
      AND target.slug IN $skillSlugs
    )

  AND (
    $relationship = ""
    OR type(relationship) = $relationship
  )

  RETURN DISTINCT
    source,
    relationship,
    target

  LIMIT $limit
`;

// ------------------------------------------------------------
// GRAPH STATISTICS
// ------------------------------------------------------------

export const GET_GRAPH_STATS = `
  OPTIONAL MATCH (s:Skill)

  WITH count(s) AS skillCount

  OPTIONAL MATCH (r:Role)

  WITH
    skillCount,
    count(r) AS roleCount

  OPTIONAL MATCH ()-[rel]->()

  RETURN
    skillCount,
    roleCount,
    count(rel) AS relationshipCount
`;