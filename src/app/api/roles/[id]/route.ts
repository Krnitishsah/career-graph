import { NextRequest, NextResponse } from "next/server";

import {
  getRoleWithSkills,
  updateRole,
  deleteRole,
} from "../../../../lib/services/role.service";

import {
  updateRoleSchema,
} from "../../../../lib/validations/role.validation";

// ============================================================
// TYPES
// ============================================================

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// ============================================================
// GET ROLE BY ID WITH REQUIRED SKILLS
// ============================================================

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Role id is required",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------------
    // GET ROLE
    // --------------------------------------------------------

    const role = await getRoleWithSkills(
      id.trim(),
    );

    // --------------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------------

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 },
      );
    }

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Role fetched successfully",
        data: role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/roles/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch role",
        error:
          error instanceof Error
            ? error.message
            : "Unknown role error",
      },
      { status: 500 },
    );
  }
}

// ============================================================
// UPDATE ROLE BY ID
// ============================================================

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Role id is required",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------------
    // PARSE BODY
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // VALIDATE BODY
    // --------------------------------------------------------

    const validation =
      updateRoleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role data",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------------
    // UPDATE ROLE
    // --------------------------------------------------------

    const role = await updateRole(
      id.trim(),
      validation.data,
    );

    // --------------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------------

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 },
      );
    }

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Role updated successfully",
        data: role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "PUT /api/roles/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update role",
        error:
          error instanceof Error
            ? error.message
            : "Unknown role error",
      },
      { status: 500 },
    );
  }
}

// ============================================================
// DELETE ROLE BY ID
// ============================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Role id is required",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------------
    // DELETE ROLE
    // --------------------------------------------------------

    const deleted = await deleteRole(
      id.trim(),
    );

    // --------------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------------

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 },
      );
    }

    // --------------------------------------------------------
    // SUCCESS
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Role deleted successfully",
        data: {
          id: id.trim(),
          deleted: true,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/roles/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete role",
        error:
          error instanceof Error
            ? error.message
            : "Unknown role error",
      },
      { status: 500 },
    );
  }
}
