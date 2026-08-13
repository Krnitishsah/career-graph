import { NextRequest, NextResponse } from "next/server";

import {
  getAllSkills,
  searchSkills,
  createSkill,
} from "../../../lib/services/skill.service";

import {
  createSkillSchema,
  skillQuerySchema,
} from "../../../lib/validations/skill.validation";

// ============================================================
// GET /api/skills
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validation =
      skillQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill query",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      search,
      category,
    } = validation.data;

    let skills;

    if (search) {
      skills = await searchSkills(search);
    } else {
      skills = await getAllSkills();
    }

    // Optional category filtering
    if (category) {
      skills = skills.filter(
        (skill) =>
          skill.category.toLowerCase() ===
          category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skills fetched successfully",
      data: skills,
      count: skills.length,
    });
  } catch (error) {
    console.error("GET /api/skills error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch skills",
        error:
          error instanceof Error
            ? error.message
            : "Unknown skill error",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/skills
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation =
      createSkillSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill data",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const skill = await createSkill(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Skill created successfully",
        data: skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/skills error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create skill",
        error:
          error instanceof Error
            ? error.message
            : "Unknown skill error",
      },
      { status: 500 }
    );
  }
}