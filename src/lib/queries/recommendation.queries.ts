// ============================================================
// RECOMMENDATION QUERIES
// ============================================================

// ------------------------------------------------------------
// CAREER RECOMMENDATIONS
// ------------------------------------------------------------

export const GET_CAREER_RECOMMENDATIONS = `
  MATCH (r:Role)-[:REQUIRES]->(required:Skill)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills

  OPTIONAL MATCH (r)-[:REQUIRES]->(matched:Skill)
  WHERE toLower(coalesce(matched.slug, "")) IN $skillSlugs

  WITH
    r,
    requiredSkills,
    collect(DISTINCT matched) AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    CASE
      WHEN size(requiredSkills) = 0 THEN 0.0
      ELSE
        toFloat(size(matchedSkills))
        / toFloat(size(requiredSkills))
        * 100.0
    END AS matchScore

  WHERE matchScore > 0

  RETURN
    r AS role,
    requiredSkills,
    matchedSkills,
    matchScore

  ORDER BY matchScore DESC, r.name ASC
  LIMIT $limit
`;

// ------------------------------------------------------------
// TOP CAREER RECOMMENDATIONS
// ------------------------------------------------------------

export const GET_TOP_CAREER_RECOMMENDATIONS = `
  MATCH (r:Role)-[:REQUIRES]->(required:Skill)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills

  OPTIONAL MATCH (r)-[:REQUIRES]->(matched:Skill)
  WHERE toLower(coalesce(matched.slug, "")) IN $skillSlugs

  WITH
    r,
    requiredSkills,
    collect(DISTINCT matched) AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    CASE
      WHEN size(requiredSkills) = 0 THEN 0.0
      ELSE
        toFloat(size(matchedSkills))
        / toFloat(size(requiredSkills))
        * 100.0
    END AS matchScore

  WHERE matchScore > 0

  RETURN
    r AS role,
    requiredSkills,
    matchedSkills,
    matchScore

  ORDER BY matchScore DESC, r.name ASC
  LIMIT $limit
`;

// ------------------------------------------------------------
// RECOMMENDATIONS BY CATEGORY
// ------------------------------------------------------------

export const GET_RECOMMENDATIONS_BY_CATEGORY = `
  MATCH (r:Role)-[:REQUIRES]->(required:Skill)

  WHERE toLower(coalesce(r.category, "")) =
        toLower($category)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills

  OPTIONAL MATCH (r)-[:REQUIRES]->(matched:Skill)
  WHERE toLower(coalesce(matched.slug, "")) IN $skillSlugs

  WITH
    r,
    requiredSkills,
    collect(DISTINCT matched) AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    CASE
      WHEN size(requiredSkills) = 0 THEN 0.0
      ELSE
        toFloat(size(matchedSkills))
        / toFloat(size(requiredSkills))
        * 100.0
    END AS matchScore

  WHERE matchScore > 0

  RETURN
    r AS role,
    requiredSkills,
    matchedSkills,
    matchScore

  ORDER BY matchScore DESC, r.name ASC
  LIMIT $limit
`;

// ------------------------------------------------------------
// ROLE MATCH DETAILS
// ------------------------------------------------------------

export const GET_ROLE_MATCH_DETAILS = `
  MATCH (r:Role {id: $roleId})
  OPTIONAL MATCH (r)-[:REQUIRES]->(required:Skill)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills

  OPTIONAL MATCH (r)-[:REQUIRES]->(matched:Skill)
  WHERE toLower(coalesce(matched.slug, "")) IN $skillSlugs

  WITH
    r,
    requiredSkills,
    collect(DISTINCT matched) AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    CASE
      WHEN size(requiredSkills) = 0 THEN 0.0
      ELSE
        toFloat(size(matchedSkills))
        / toFloat(size(requiredSkills))
        * 100.0
    END AS matchScore

  RETURN
    r AS role,
    requiredSkills,
    matchedSkills,
    matchScore
`;

// ------------------------------------------------------------
// MISSING SKILLS FOR ROLE
// ------------------------------------------------------------

export const GET_MISSING_SKILLS_FOR_ROLE = `
  MATCH (r:Role {id: $roleId})-[:REQUIRES]->(skill:Skill)

  WHERE NOT toLower(coalesce(skill.slug, "")) IN $skillSlugs

  RETURN DISTINCT skill
  ORDER BY skill.name
`;

// ------------------------------------------------------------
// BEST NEXT SKILLS
// ------------------------------------------------------------

export const GET_BEST_NEXT_SKILLS = `
  MATCH (r:Role)-[:REQUIRES]->(requiredSkill:Skill)

  WHERE NOT toLower(coalesce(requiredSkill.slug, "")) IN $skillSlugs

  WITH
    requiredSkill,
    count(DISTINCT r) AS roleCount

  RETURN
    requiredSkill,
    roleCount

  ORDER BY roleCount DESC, requiredSkill.name ASC
  LIMIT $limit
`;

// ------------------------------------------------------------
// RECOMMENDATIONS WITH ADDITIONAL SKILL
// ------------------------------------------------------------

export const GET_RECOMMENDATIONS_WITH_ADDITIONAL_SKILL = `
  WITH
    $skillSlugs + [$additionalSkillSlug] AS combinedSkills

  MATCH (r:Role)-[:REQUIRES]->(required:Skill)

  WITH
    r,
    collect(DISTINCT required) AS requiredSkills,
    combinedSkills

  OPTIONAL MATCH (r)-[:REQUIRES]->(matched:Skill)
  WHERE toLower(coalesce(matched.slug, "")) IN combinedSkills

  WITH
    r,
    requiredSkills,
    collect(DISTINCT matched) AS matchedSkills

  WITH
    r,
    requiredSkills,
    matchedSkills,
    CASE
      WHEN size(requiredSkills) = 0 THEN 0.0
      ELSE
        toFloat(size(matchedSkills))
        / toFloat(size(requiredSkills))
        * 100.0
    END AS matchScore

  WHERE matchScore > 0

  RETURN
    r AS role,
    requiredSkills,
    matchedSkills,
    matchScore

  ORDER BY matchScore DESC, r.name ASC
  LIMIT $limit
`;