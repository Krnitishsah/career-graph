import { NextRequest, NextResponse } from "next/server";

import {
  getCareerRecommendations,
  getTopCareerRecommendations,
  getRecommendationsByCategory,
  getRecommendationSummary,
  getBestNextSkills,
} from "../../../lib/services/recommendation.service";

// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_TYPES = [
  "career",
  "top",
  "category",
  "next-skills",
  "summary",
] as const;

type RecommendationType =
  (typeof ALLOWED_TYPES)[number];

// ============================================================
// HELPERS
// ============================================================

function isRecommendationType(
  value: string
): value is RecommendationType {
  return ALLOWED_TYPES.includes(
    value as RecommendationType
  );
}

// ------------------------------------------------------------
// Parse skill slugs
// ------------------------------------------------------------

function parseSkillSlugs(
  value: string | null
): string[] {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(",")
        .map((skill) =>
          skill.trim().toLowerCase()
        )
        .filter(Boolean)
    )
  );
}

// ------------------------------------------------------------
// Parse limit
// ------------------------------------------------------------

function parseLimit(
  value: string | null
): number {
  if (!value) {
    return 10;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 10;
  }

  return Math.min(
    Math.max(Math.floor(parsed), 1),
    50
  );
}

// ============================================================
// GET /api/recommendations
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = request.nextUrl;

    // --------------------------------------------------------
    // Query parameters
    // --------------------------------------------------------

    const typeParam =
      searchParams.get("type") ?? "career";

    const skillSlugsParam =
      searchParams.get("skillSlugs");

    const categoryParam =
      searchParams.get("category");

    const limitParam =
      searchParams.get("limit");

    // --------------------------------------------------------
    // Validate recommendation type
    // --------------------------------------------------------

    if (!isRecommendationType(typeParam)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid recommendation type",
          allowedTypes: ALLOWED_TYPES,
        },
        { status: 400 }
      );
    }

    const type = typeParam;

    // --------------------------------------------------------
    // Parse skill slugs
    // --------------------------------------------------------

    const skillSlugs =
      parseSkillSlugs(skillSlugsParam);

    // --------------------------------------------------------
    // Validate skill slugs
    // --------------------------------------------------------

    if (!skillSlugs.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "skillSlugs query parameter is required",
          example:
            "/api/recommendations?skillSlugs=react,typescript,javascript",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Parse limit
    // --------------------------------------------------------

    const limit =
      parseLimit(limitParam);

    // --------------------------------------------------------
    // Parse category
    // --------------------------------------------------------

    const category =
      categoryParam?.trim() || null;

    // --------------------------------------------------------
    // Execute recommendation query
    // --------------------------------------------------------

    let data;

    switch (type) {
      // ------------------------------------------------------
      // CAREER
      // ------------------------------------------------------

      case "career": {
        data =
          await getCareerRecommendations(
            skillSlugs,
            limit
          );

        break;
      }

      // ------------------------------------------------------
      // TOP CAREER
      // ------------------------------------------------------

      case "top": {
        data =
          await getTopCareerRecommendations(
            skillSlugs,
            limit
          );

        break;
      }

      // ------------------------------------------------------
      // CATEGORY
      // ------------------------------------------------------

      case "category": {
        if (!category) {
          return NextResponse.json(
            {
              success: false,
              message:
                "category is required when type=category",
              example:
                "/api/recommendations?type=category&category=Frontend&skillSlugs=react,typescript",
            },
            { status: 400 }
          );
        }

        data =
          await getRecommendationsByCategory(
            skillSlugs,
            category,
            limit
          );

        break;
      }

      // ------------------------------------------------------
      // NEXT SKILLS
      // ------------------------------------------------------

      case "next-skills": {
        data =
          await getBestNextSkills(
            skillSlugs,
            limit
          );

        break;
      }

      // ------------------------------------------------------
      // SUMMARY
      // ------------------------------------------------------

      case "summary": {
        data =
          await getRecommendationSummary(
            skillSlugs
          );

        break;
      }
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Recommendations fetched successfully",
      data,
      ...(Array.isArray(data)
        ? {
            count: data.length,
          }
        : {}),
    });
  } catch (error) {
    console.error(
      "Recommendation API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch recommendations",
        error:
          error instanceof Error
            ? error.message
            : "Unknown recommendation error",
      },
      { status: 500 }
    );
  }
}
