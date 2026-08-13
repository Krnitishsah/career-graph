import neo4j from "neo4j-driver";

import config from "../lib/cognodb/config";

// ============================================================
// ROLE → SKILL RELATIONSHIPS
// ============================================================

const roleSkillRelationships = [
  // ==========================================================
  // FRONTEND DEVELOPER
  // ==========================================================

  {
    role: "frontend-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "html",
      "css",
      "tailwind-css",
      "git",
      "github",
    ],
  },

  // ==========================================================
  // REACT DEVELOPER
  // ==========================================================

  {
    role: "react-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "html",
      "css",
      "redux-toolkit",
      "rtk-query",
      "git",
      "github",
    ],
  },

  // ==========================================================
  // NEXT.JS DEVELOPER
  // ==========================================================

  {
    role: "nextjs-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "html",
      "css",
      "tailwind-css",
      "rest-api",
      "git",
      "github",
    ],
  },

  // ==========================================================
  // FULL STACK DEVELOPER
  // ==========================================================

  {
    role: "full-stack-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "expressjs",
      "rest-api",
      "mongodb",
      "postgresql",
      "git",
      "github",
      "docker",
    ],
  },

  // ==========================================================
  // BACKEND DEVELOPER
  // ==========================================================

  {
    role: "backend-developer",
    skills: [
      "javascript",
      "typescript",
      "nodejs",
      "expressjs",
      "rest-api",
      "mongodb",
      "postgresql",
      "git",
      "github",
      "docker",
    ],
  },

  // ==========================================================
  // MOBILE DEVELOPER
  // ==========================================================

  {
    role: "mobile-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "react-native",
      "expo",
      "rest-api",
      "git",
      "github",
    ],
  },

  // ==========================================================
  // NODE.JS DEVELOPER
  // ==========================================================

  {
    role: "nodejs-developer",
    skills: [
      "javascript",
      "typescript",
      "nodejs",
      "expressjs",
      "rest-api",
      "mongodb",
      "postgresql",
      "git",
      "github",
      "docker",
    ],
  },

  // ==========================================================
  // JAVASCRIPT DEVELOPER
  // ==========================================================

  {
    role: "javascript-developer",
    skills: [
      "javascript",
      "html",
      "css",
      "react",
      "nodejs",
      "expressjs",
      "rest-api",
      "git",
      "github",
    ],
  },

  // ==========================================================
  // FULL STACK JAVASCRIPT DEVELOPER
  // ==========================================================

  {
    role: "full-stack-javascript-developer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "nodejs",
      "expressjs",
      "rest-api",
      "mongodb",
      "postgresql",
      "redux-toolkit",
      "git",
      "github",
      "docker",
    ],
  },

  // ==========================================================
  // FRONTEND ENGINEER
  // ==========================================================

  {
    role: "frontend-engineer",
    skills: [
      "javascript",
      "typescript",
      "react",
      "nextjs",
      "html",
      "css",
      "tailwind-css",
      "redux-toolkit",
      "rtk-query",
      "rest-api",
      "git",
      "github",
    ],
  },
];

// ============================================================
// SEED RELATIONSHIPS
// ============================================================

async function seedRelationships(): Promise<void> {
  // ----------------------------------------------------------
  // VALIDATE CONFIG
  // ----------------------------------------------------------

  if (!config.url) {
    throw new Error("COGNODB_URL is not configured");
  }

  if (!config.username) {
    throw new Error("COGNODB_USERNAME is not configured");
  }

  if (!config.password) {
    throw new Error("COGNODB_PASSWORD is not configured");
  }

  if (!config.database) {
    throw new Error("COGNODB_DATABASE is not configured");
  }

  // ----------------------------------------------------------
  // CREATE DRIVER
  // ----------------------------------------------------------

  const driver = neo4j.driver(
    config.url,
    neo4j.auth.basic(
      config.username,
      config.password
    )
  );

  const session = driver.session({
    database: config.database,
  });

  try {
    console.log("========================================");
    console.log("       Career Graph Relationships        ");
    console.log("========================================");
    console.log("");

    console.log("Connecting to CognoDB...");

    await driver.verifyConnectivity();

    console.log("Connected successfully.");
    console.log("");

    // --------------------------------------------------------
    // CREATE RELATIONSHIPS
    // --------------------------------------------------------

    let relationshipCount = 0;

    for (const item of roleSkillRelationships) {
      console.log(`Processing: ${item.role}`);

      for (const skill of item.skills) {
        const result = await session.run(
          `
          MATCH (r:Role {slug: $roleSlug})
          MATCH (s:Skill {slug: $skillSlug})

          MERGE (r)-[rel:REQUIRES_SKILL]->(s)

          RETURN
            r.name AS role,
            s.name AS skill,
            rel
          `,
          {
            roleSlug: item.role,
            skillSlug: skill,
          }
        );

        if (result.records.length > 0) {
          relationshipCount++;

          const roleName = result.records[0].get("role");
          const skillName = result.records[0].get("skill");

          console.log(
            `  ✓ ${roleName} → ${skillName}`
          );
        } else {
          console.warn(
            `  ⚠ Missing role or skill: ${item.role} → ${skill}`
          );
        }
      }

      console.log("");
    }

    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    console.log("========================================");
    console.log("Relationship seeding completed.");
    console.log(`Relationships processed: ${relationshipCount}`);
    console.log("========================================");
  } catch (error) {
    console.error("");
    console.error(
      "Relationship seeding failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

// ============================================================
// RUN
// ============================================================

seedRelationships();