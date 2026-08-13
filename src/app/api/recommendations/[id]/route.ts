import { NextRequest, NextResponse } from "next/server";

import {
  getRoleMatchDetails,
  getMissingSkillsForRole,
} from "../../../../lib/services/recommendation.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET /api/recommendations/:id
// ============================================================
//
// Example:
// GET /api/recommendations/role-frontend-developer
//   ?skillSlugs=react,typescript,javascript
//
// id        -> Role ID
// skillSlugs -> User's selected skills
//
// Returns:
// - role
// - required skills
// - matched skills
// - match score
// - missing skills
// ============================================================

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // ----------------------------------------------------------
    // Validate ID
    // ----------------------------------------------------------

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Recommendation ID is required",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Get query parameters
    // ----------------------------------------------------------

    const { searchParams } = request.nextUrl;

    const skillSlugsParam =
      searchParams.get("skillSlugs");

    // ----------------------------------------------------------
    // Validate skillSlugs
    // ----------------------------------------------------------

    const skillSlugs = skillSlugsParam
      ? skillSlugsParam
          .split(",")
          .map((skill) => skill.trim().toLowerCase())
          .filter(Boolean)
      : [];

    if (!skillSlugs.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "skillSlugs query parameter is required",
          example:
            `/api/recommendations/${id}?skillSlugs=react,typescript,javascript`,
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------------------
    // Get role match details
    // ----------------------------------------------------------

    const recommendation =
      await getRoleMatchDetails(
        id.trim(),
        skillSlugs
      );

    if (!recommendation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Recommendation role not found",
        },
        { status: 404 }
      );
    }

    // ----------------------------------------------------------
    // Get missing skills
    // ----------------------------------------------------------

    const missingSkills =
      await getMissingSkillsForRole(
        id.trim(),
        skillSlugs
      );

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Recommendation details fetched successfully",

      data: {
        ...recommendation,
        missingSkills,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/recommendations/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch recommendation details",
        error:
          error instanceof Error
            ? error.message
            : "Unknown recommendation error",
      },
      { status: 500 }
    );
  }
}
