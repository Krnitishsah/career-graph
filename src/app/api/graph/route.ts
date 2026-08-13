// import { NextRequest, NextResponse } from "next/server";

// import {
//   getGraph,
//   getSkillGraph,
//   getRoleGraph,
//   searchGraph,
//   getGraphByCategory,
//   getGraphBySkills,
//   getRolesBySkills,
//   getGraphStats,
// } from "../../../lib/services/graph.service";

// // ============================================================
// // HELPERS
// // ============================================================

// function parseLimit(value: string | null, fallback = 100) {
//   const parsed = Number(value || fallback);

//   if (!Number.isFinite(parsed)) {
//     return fallback;
//   }

//   return Math.min(Math.max(parsed, 1), 500);
// }

// function parseSkills(value: string | null) {
//   if (!value) return [];

//   return value
//     .split(",")
//     .map((skill) => skill.trim().toLowerCase())
//     .filter(Boolean);
// }

// // ============================================================
// // GET /api/graph
// // ============================================================

// export async function GET(request: NextRequest) {
//   try {
//     const params = request.nextUrl.searchParams;

//     const action = params.get("action");
//     const search = params.get("search");
//     const category = params.get("category");
//     const skills = params.get("skills");

//     const limit = parseLimit(params.get("limit"));

//     // ========================================================
//     // GRAPH STATS
//     // /api/graph?action=stats
//     // ========================================================

//     if (action === "stats") {
//       const data = await getGraphStats();

//       return NextResponse.json({
//         success: true,
//         message: "Graph statistics fetched successfully",
//         data,
//       });
//     }

//     // ========================================================
//     // SELECTED SKILLS GRAPH
//     //
//     // /api/graph?skills=typescript,react,next-js
//     // ========================================================

//     if (skills) {
//       const skillSlugs = parseSkills(skills);

//       if (!skillSlugs.length) {
//         return NextResponse.json({
//           success: true,
//           message: "No skills selected",
//           data: {
//             nodes: [],
//             relationships: [],
//           },
//           roles: [],
//         });
//       }

//       const [graph, roles] = await Promise.all([
//         getGraphBySkills(skillSlugs),
//         getRolesBySkills(skillSlugs, limit),
//       ]);

//       return NextResponse.json({
//         success: true,
//         message: "Selected skills graph fetched successfully",

//         data: graph,

//         roles,

//         selectedSkills: skillSlugs,

//         count: graph.nodes.length,
//       });
//     }

//     // ========================================================
//     // SKILL GRAPH
//     // /api/graph?action=skills
//     // ========================================================

//     if (action === "skills") {
//       const data = await getSkillGraph(limit);

//       return NextResponse.json({
//         success: true,
//         message: "Skill graph fetched successfully",
//         data,
//         count: data.nodes.length,
//       });
//     }

//     // ========================================================
//     // ROLE GRAPH
//     // /api/graph?action=roles
//     // ========================================================

//     if (action === "roles") {
//       const data = await getRoleGraph(limit);

//       return NextResponse.json({
//         success: true,
//         message: "Role graph fetched successfully",
//         data,
//         count: data.nodes.length,
//       });
//     }

//     // ========================================================
//     // SEARCH GRAPH
//     // /api/graph?search=react
//     // ========================================================

//     if (search) {
//       const data = await searchGraph(search, limit);

//       return NextResponse.json({
//         success: true,
//         message: "Graph search completed successfully",
//         data,
//         count: data.nodes.length,
//       });
//     }

//     // ========================================================
//     // CATEGORY GRAPH
//     // /api/graph?category=Frontend
//     // ========================================================

//     if (category) {
//       const data = await getGraphByCategory(category, limit);

//       return NextResponse.json({
//         success: true,
//         message: "Category graph fetched successfully",
//         data,
//         count: data.nodes.length,
//       });
//     }

//     // ========================================================
//     // DEFAULT GRAPH
//     // /api/graph
//     // ========================================================

//     const data = await getGraph(limit);

//     return NextResponse.json({
//       success: true,
//       message: "Graph fetched successfully",
//       data,
//       count: data.nodes.length,
//     });
//   } catch (error) {
//     console.error("GET /api/graph error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch graph",
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown graph error",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";

import {
  getGraph,
  getSkillGraph,
  getRoleGraph,
  searchGraph,
  getGraphByCategory,
  getGraphBySkills,
  getRolesBySkills,
  getGraphStats,
} from "../../../lib/services/graph.service";

// ============================================================
// HELPERS
// ============================================================

function parseLimit(
  value: string | null,
  fallback = 100,
): number {
  const parsed = Number(value ?? fallback);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 500);
}

function parseSkills(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

// ============================================================
// GET /api/graph
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const action = params.get("action");
    const search = params.get("search");
    const category = params.get("category");
    const skills = params.get("skills");

    const limit = parseLimit(params.get("limit"));

    // ========================================================
    // GRAPH STATS
    // GET /api/graph?action=stats
    // ========================================================

    if (action === "stats") {
      const data = await getGraphStats();

      return NextResponse.json({
        success: true,
        message: "Graph statistics fetched successfully",
        data,
      });
    }

    // ========================================================
    // SELECTED SKILLS GRAPH
    // GET /api/graph?skills=typescript,react,next-js
    // ========================================================

    if (skills !== null) {
      const skillSlugs = parseSkills(skills);

      if (skillSlugs.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No skills selected",
          data: {
            nodes: [],
            relationships: [],
          },
          roles: [],
          selectedSkills: [],
          count: 0,
        });
      }

      const [graph, roles] = await Promise.all([
        getGraphBySkills(skillSlugs),
        getRolesBySkills(skillSlugs, limit),
      ]);

      return NextResponse.json({
        success: true,
        message:
          "Selected skills graph fetched successfully",
        data: graph,
        roles,
        selectedSkills: skillSlugs,
        count: graph.nodes.length,
      });
    }

    // ========================================================
    // SKILL GRAPH
    // GET /api/graph?action=skills
    // ========================================================

    if (action === "skills") {
      const data = await getSkillGraph(limit);

      return NextResponse.json({
        success: true,
        message: "Skill graph fetched successfully",
        data,
        count: data.nodes.length,
      });
    }

    // ========================================================
    // ROLE GRAPH
    // GET /api/graph?action=roles
    // ========================================================

    if (action === "roles") {
      const data = await getRoleGraph(limit);

      return NextResponse.json({
        success: true,
        message: "Role graph fetched successfully",
        data,
        count: data.nodes.length,
      });
    }

    // ========================================================
    // SEARCH GRAPH
    // GET /api/graph?search=react
    // ========================================================

    if (search) {
      const data = await searchGraph(search, limit);

      return NextResponse.json({
        success: true,
        message: "Graph search completed successfully",
        data,
        count: data.nodes.length,
      });
    }

    // ========================================================
    // CATEGORY GRAPH
    // GET /api/graph?category=Frontend
    // ========================================================

    if (category) {
      const data = await getGraphByCategory(
        category,
        limit,
      );

      return NextResponse.json({
        success: true,
        message: "Category graph fetched successfully",
        data,
        count: data.nodes.length,
      });
    }

    // ========================================================
    // DEFAULT GRAPH
    // GET /api/graph
    // ========================================================

    const data = await getGraph(limit);

    return NextResponse.json({
      success: true,
      message: "Graph fetched successfully",
      data,
      count: data.nodes.length,
    });
  } catch (error) {
    console.error("GET /api/graph error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch graph",
        error:
          error instanceof Error
            ? error.message
            : "Unknown graph error",
      },
      {
        status: 500,
      },
    );
  }
}
