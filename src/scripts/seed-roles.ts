import neo4j from "neo4j-driver";

import config from "../lib/cognodb/config";

// ============================================================
// ROLE DATA
// ============================================================

const roles = [
  {
    name: "Frontend Developer",
    slug: "frontend-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer focused on building responsive and interactive web interfaces.",
    salaryRange: "₹5L - ₹12L",
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

  {
    name: "React Developer",
    slug: "react-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer specializing in modern React-based web applications.",
    salaryRange: "₹5L - ₹14L",
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

  {
    name: "Next.js Developer",
    slug: "nextjs-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer specializing in production-ready applications using Next.js.",
    salaryRange: "₹6L - ₹15L",
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

  {
    name: "Full Stack Developer",
    slug: "full-stack-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer capable of building both frontend and backend applications.",
    salaryRange: "₹6L - ₹16L",
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

  {
    name: "Backend Developer",
    slug: "backend-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer focused on APIs, server-side systems, and backend architecture.",
    salaryRange: "₹6L - ₹15L",
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

  {
    name: "Mobile Developer",
    slug: "mobile-developer",
    category: "Mobile Development",
    level: "Mid-Level",
    description:
      "Developer focused on building cross-platform mobile applications.",
    salaryRange: "₹5L - ₹14L",
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

  {
    name: "Node.js Developer",
    slug: "nodejs-developer",
    category: "Backend Development",
    level: "Mid-Level",
    description:
      "Backend developer specializing in Node.js server applications and APIs.",
    salaryRange: "₹6L - ₹15L",
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

  {
    name: "JavaScript Developer",
    slug: "javascript-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Developer specializing in JavaScript-based web applications.",
    salaryRange: "₹5L - ₹13L",
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

  {
    name: "Full Stack JavaScript Developer",
    slug: "full-stack-javascript-developer",
    category: "Software Development",
    level: "Mid-Level",
    description:
      "Full stack developer specializing in the JavaScript ecosystem.",
    salaryRange: "₹7L - ₹18L",
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

  {
    name: "Frontend Engineer",
    slug: "frontend-engineer",
    category: "Engineering",
    level: "Senior",
    description:
      "Software engineer specializing in scalable frontend architecture and user experiences.",
    salaryRange: "₹10L - ₹25L",
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
// SEED ROLES
// ============================================================

async function seedRoles(): Promise<void> {
  // ----------------------------------------------------------
  // ENVIRONMENT VALIDATION
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
  // DRIVER
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
    console.log("=================================");
    console.log("       Career Graph Seeder        ");
    console.log("=================================");
    console.log("");

    console.log("Connecting to CognoDB...");

    await driver.verifyConnectivity();

    console.log("Connected successfully.");
    console.log("");

    console.log(`Seeding ${roles.length} roles...`);
    console.log("");

    // --------------------------------------------------------
    // CREATE ROLES + RELATIONSHIPS
    // --------------------------------------------------------

    for (const role of roles) {
      const roleId = crypto.randomUUID();

      await session.executeWrite(async (tx) => {
        // ----------------------------------------------------
        // CREATE / UPDATE ROLE
        // ----------------------------------------------------

        await tx.run(
          `
          MERGE (r:Role {slug: $slug})
          SET
            r.id = coalesce(r.id, $id),
            r.name = $name,
            r.slug = $slug,
            r.category = $category,
            r.level = $level,
            r.description = $description,
            r.salaryRange = $salaryRange
          `,
          {
            id: roleId,
            name: role.name,
            slug: role.slug,
            category: role.category,
            level: role.level,
            description: role.description,
            salaryRange: role.salaryRange,
          }
        );

        // ----------------------------------------------------
        // CREATE ROLE → SKILL RELATIONSHIPS
        // IMPORTANT:
        // Recommendation queries use [:REQUIRES]
        // ----------------------------------------------------

        for (const skillSlug of role.skills) {
          await tx.run(
            `
            MATCH (r:Role {slug: $roleSlug})
            MATCH (s:Skill {slug: $skillSlug})

            MERGE (r)-[:REQUIRES]->(s)
            `,
            {
              roleSlug: role.slug,
              skillSlug,
            }
          );
        }
      });

      console.log(`✓ ${role.name}`);
    }

    console.log("");
    console.log("=================================");
    console.log("Role seeding completed.");
    console.log("=================================");
  } catch (error) {
    console.error("");
    console.error("Role seeding failed:", error);

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

// ============================================================
// RUN
// ============================================================

seedRoles();
