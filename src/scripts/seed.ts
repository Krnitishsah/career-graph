// ============================================================
// LOAD ENVIRONMENT VARIABLES
// ============================================================

import "dotenv/config";

import neo4j from "neo4j-driver";

import config from "../lib/cognodb/config";

// ============================================================
// SKILL DATA
// ============================================================

const skills = [
  // ==========================================================
  // FRONTEND
  // ==========================================================

  {
    name: "JavaScript",
    slug: "javascript",
    category: "Frontend",
    description:
      "Programming language widely used for interactive web applications.",
  },
  {
    name: "TypeScript",
    slug: "typescript",
    category: "Frontend",
    description:
      "Typed superset of JavaScript for scalable application development.",
  },
  {
    name: "React",
    slug: "react",
    category: "Frontend",
    description:
      "JavaScript library for building component-based user interfaces.",
  },
  {
    name: "Next.js",
    slug: "nextjs",
    category: "Frontend",
    description:
      "React framework for full-stack web applications.",
  },
  {
    name: "HTML",
    slug: "html",
    category: "Frontend",
    description:
      "Standard markup language for structuring web pages.",
  },
  {
    name: "CSS",
    slug: "css",
    category: "Frontend",
    description:
      "Style sheet language used to design web interfaces.",
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    category: "Frontend",
    description:
      "Utility-first CSS framework for rapidly building modern interfaces.",
  },

  // ==========================================================
  // BACKEND
  // ==========================================================

  {
    name: "Node.js",
    slug: "nodejs",
    category: "Backend",
    description:
      "JavaScript runtime for building server-side applications.",
  },
  {
    name: "Express.js",
    slug: "expressjs",
    category: "Backend",
    description:
      "Minimal Node.js web framework for APIs and server applications.",
  },
  {
    name: "REST API",
    slug: "rest-api",
    category: "Backend",
    description:
      "Architectural style for building HTTP-based APIs.",
  },

  // ==========================================================
  // DATABASE
  // ==========================================================

  {
    name: "MongoDB",
    slug: "mongodb",
    category: "Database",
    description:
      "Document-oriented NoSQL database.",
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    category: "Database",
    description:
      "Open-source relational database management system.",
  },
  {
    name: "Neo4j",
    slug: "neo4j",
    category: "Database",
    description:
      "Graph database platform for connected data.",
  },

  // ==========================================================
  // STATE MANAGEMENT
  // ==========================================================

  {
    name: "Redux Toolkit",
    slug: "redux-toolkit",
    category: "State Management",
    description:
      "Official recommended approach for writing Redux logic.",
  },
  {
    name: "RTK Query",
    slug: "rtk-query",
    category: "State Management",
    description:
      "Data fetching and caching solution included with Redux Toolkit.",
  },

  // ==========================================================
  // MOBILE
  // ==========================================================

  {
    name: "React Native",
    slug: "react-native",
    category: "Mobile",
    description:
      "Framework for building native mobile applications using React.",
  },
  {
    name: "Expo",
    slug: "expo",
    category: "Mobile",
    description:
      "Development platform for React Native applications.",
  },

  // ==========================================================
  // DEVOPS
  // ==========================================================

  {
    name: "Docker",
    slug: "docker",
    category: "DevOps",
    description:
      "Platform for containerizing and deploying applications.",
  },

  // ==========================================================
  // TOOLS
  // ==========================================================

  {
    name: "Git",
    slug: "git",
    category: "Tools",
    description:
      "Distributed version control system.",
  },
  {
    name: "GitHub",
    slug: "github",
    category: "Tools",
    description:
      "Platform for hosting and collaborating on Git repositories.",
  },
  {
    name: "Postman",
    slug: "postman",
    category: "Tools",
    description:
      "API development and testing platform.",
  },
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed(): Promise<void> {
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
    // --------------------------------------------------------
    // CONNECTION TEST
    // --------------------------------------------------------

    console.log("Connecting to CognoDB...");

    await driver.verifyConnectivity();

    console.log("Connected successfully.");

    // --------------------------------------------------------
    // SEED SKILLS
    // --------------------------------------------------------

    console.log(
      `Seeding ${skills.length} skills...`
    );

    for (const skill of skills) {
      await session.run(
        `
        MERGE (s:Skill {slug: $slug})
        SET
          s.id = $id,
          s.name = $name,
          s.category = $category,
          s.description = $description
        `,
        {
          id: crypto.randomUUID(),
          name: skill.name,
          slug: skill.slug,
          category: skill.category,
          description: skill.description,
        }
      );

      console.log(`✓ ${skill.name}`);
    }

    console.log("");
    console.log(
      "Skill seeding completed successfully."
    );
  } catch (error) {
    console.error("");
    console.error("Seed failed:", error);

    process.exitCode = 1;
  } finally {
    // --------------------------------------------------------
    // CLOSE CONNECTIONS
    // --------------------------------------------------------

    await session.close();
    await driver.close();
  }
}

// ============================================================
// RUN SEED
// ============================================================

seed();