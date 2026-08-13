import { NextRequest, NextResponse } from "next/server";

import {
  getSkillById,
  updateSkill,
  deleteSkill,
  getSkillWithRelatedSkills,
} from "@/lib/services/skill.service";

import {
  updateSkillSchema,
} from "@/lib/validations/skill.validation";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET /api/skills/:id
// ============================================================

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required",
        },
        { status: 400 }
      );
    }

    const includeRelated =
      request.nextUrl.searchParams.get(
        "related"
      ) === "true";

    const skill = includeRelated
      ? await getSkillWithRelatedSkills(id)
      : await getSkillById(id);

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skill fetched successfully",
      data: skill,
    });
  } catch (error) {
    console.error(
      "GET /api/skills/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch skill",
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
// PUT /api/skills/:id
// ============================================================

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validation =
      updateSkillSchema.safeParse(body);

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

    const existingSkill =
      await getSkillById(id);

    if (!existingSkill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    const skill = await updateSkill(id, {
      name:
        validation.data.name ??
        existingSkill.name,

      slug:
        validation.data.slug ??
        existingSkill.slug,

      category:
        validation.data.category ??
        existingSkill.category,

      description:
        validation.data.description ??
        existingSkill.description ??
        null,
    });

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error(
      "PUT /api/skills/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update skill",
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
// DELETE /api/skills/:id
// ============================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required",
        },
        { status: 400 }
      );
    }

    const deleted = await deleteSkill(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Skill deleted successfully",
      data: {
        id,
        deleted: true,
      },
    });
  } catch (error) {
    console.error(
      "DELETE /api/skills/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete skill",
        error:
          error instanceof Error
            ? error.message
            : "Unknown skill error",
      },
      { status: 500 }
    );
  }
}