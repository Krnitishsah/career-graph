import neo4j from "neo4j-driver";

import config from "../lib/cognodb/config";

// ============================================================
// SKILLS
// ============================================================

const skills = [
  // Frontend
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
      "React framework for production-ready full-stack web applications.",
  },
  {
    name: "HTML",
    slug: "html",
    category: "Frontend",
    description:
      "Standard markup language used to structure web pages.",
  },
  {
    name: "CSS",
    slug: "css",
    category: "Frontend",
    description:
      "Style sheet language used to style web interfaces.",
  },
  {
    name: "Tailwind CSS",
    slug: "tailwind-css",
    category: "Frontend",
    description:
      "Utility-first CSS framework for building modern responsive interfaces.",
  },

  // Backend
  {
    name: "Node.js",
    slug: "nodejs",
    category: "Backend",
    description:
      "JavaScript runtime used for server-side application development.",
  },
  {
    name: "Express.js",
    slug: "expressjs",
    category: "Backend",
    description:
      "Minimal and flexible Node.js framework for APIs and web applications.",
  },
  {
    name: "REST API",
    slug: "rest-api",
    category: "Backend",
    description:
      "HTTP-based architectural approach for building APIs.",
  },

  // Database
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
      "Graph database technology for storing and querying connected data.",
  },

  // State Management
  {
    name: "Redux Toolkit",
    slug: "redux-toolkit",
    category: "State Management",
    description:
      "Official recommended toolset for efficient Redux development.",
  },
  {
    name: "RTK Query",
    slug: "rtk-query",
    category: "State Management",
    description:
      "Data fetching, caching, and synchronization solution for Redux Toolkit.",
  },

  // Mobile
  {
    name: "React Native",
    slug: "react-native",
    category: "Mobile",
    description:
      "Framework for building native mobile applications with React.",
  },
  {
    name: "Expo",
    slug: "expo",
    category: "Mobile",
    description:
      "Development platform for React Native applications.",
  },

  // DevOps
  {
    name: "Docker",
    slug: "docker",
    category: "DevOps",
    description:
      "Platform for developing, packaging, and running applications in containers.",
  },

  // Tools
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
      "Platform for Git repository hosting and collaboration.",
  },
  {
    name: "Postman",
    slug: "postman",
    category: "Tools",
    description:
      "Platform for API development and testing.",
  },
];

// ============================================================
// SEED SKILLS
// ============================================================

async function seedSkills(): Promise<void> {
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
    console.log(`Seeding ${skills.length} skills...`);
    console.log("");

    for (const skill of skills) {
      await session.run(
        `
        MERGE (s:Skill {slug: $slug})
        SET
          s.id = coalesce(s.id, $id),
          s.name = $name,
          s.slug = $slug,
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
    console.log("=================================");
    console.log("Skill seeding completed.");
    console.log("=================================");
  } catch (error) {
    console.error("");
    console.error("Skill seeding failed:", error);

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seedSkills();