import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getAllSkills,
  searchSkills,
  createSkill,
  getSkillById,
  getSkillBySlug,
  updateSkill,
  deleteSkill,
} from "../../../lib/services/skill.service";

import {
  createSkillSchema,
  updateSkillSchema,
  skillQuerySchema,
} from "../../../lib/validations/skill.validation";

// ============================================================
// GET /api/skills
// ============================================================

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validation =
      skillQuerySchema.safeParse(
        searchParams
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill query",
          errors:
            validation.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      id,
      slug,
      search,
      category,
    } = validation.data;

    // ========================================================
    // BY ID
    // ========================================================

    if (id) {
      const skill =
        await getSkillById(id);

      if (!skill) {
        return NextResponse.json(
          {
            success: false,
            message: "Skill not found",
            data: null,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "Skill fetched successfully",
        data: skill,
      });
    }

    // ========================================================
    // BY SLUG
    // ========================================================

    if (slug) {
      const skill =
        await getSkillBySlug(slug);

      if (!skill) {
        return NextResponse.json(
          {
            success: false,
            message: "Skill not found",
            data: null,
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "Skill fetched successfully",
        data: skill,
      });
    }

    // ========================================================
    // SEARCH / ALL
    // ========================================================

    let skills = search
      ? await searchSkills(search)
      : await getAllSkills();

    // ========================================================
    // CATEGORY
    // ========================================================

    if (category) {
      skills = skills.filter(
        (skill) =>
          skill.category.toLowerCase() ===
          category.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Skills fetched successfully",
      data: skills,
      count: skills.length,
    });
  } catch (error) {
    console.error(
      "GET /api/skills error:",
      error
    );

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

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const validation =
      createSkillSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill data",
          errors:
            validation.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const skill =
      await createSkill(
        validation.data
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Skill created successfully",
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

// ============================================================
// PUT /api/skills?id=...
// ============================================================

export async function PUT(
  request: NextRequest
) {
  try {
    const id =
      request.nextUrl.searchParams.get(
        "id"
      );

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required",
        },
        { status: 400 }
      );
    }

    const body =
      await request.json();

    const validation =
      updateSkillSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skill data",
          errors:
            validation.error.flatten()
              .fieldErrors,
        },
        { status: 400 }
      );
    }

    const existing =
      await getSkillById(id);

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    const input = {
      name:
        validation.data.name ??
        existing.name,

      slug:
        validation.data.slug ??
        existing.slug,

      category:
        validation.data.category ??
        existing.category,

      description:
        validation.data.description ??
        existing.description ??
        null,

      level:
        validation.data.level ??
        existing.level,
    };

    const skill =
      await updateSkill(
        id,
        input
      );

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
      message:
        "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error(
      "PUT /api/skills error:",
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
// DELETE /api/skills?id=...
// ============================================================

export async function DELETE(
  request: NextRequest
) {
  try {
    const id =
      request.nextUrl.searchParams.get(
        "id"
      );

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Skill ID is required",
        },
        { status: 400 }
      );
    }

    const deleted =
      await deleteSkill(id);

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
      message:
        "Skill deleted successfully",
      data: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "DELETE /api/skills error:",
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