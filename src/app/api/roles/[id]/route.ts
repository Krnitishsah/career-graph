import { NextRequest, NextResponse } from "next/server";

import {
  getRoleById,
  updateRole,
  deleteRole,
} from "../../../../lib/services/role.service";

import {
  updateRoleSchema,
} from "../../../../lib/validations/role.validation";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const role = await getRoleById(id);

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Role fetched successfully",
      data: role,
    });
  } catch (error) {
    console.error(
      "Get role API error:",
      error
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
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

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
        { status: 400 }
      );
    }

    const role = await updateRole(
      id,
      validation.data
    );

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    console.error(
      "Update role API error:",
      error
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
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const deleted = await deleteRole(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Role deleted successfully",
      data: {
        id,
        deleted: true,
      },
    });
  } catch (error) {
    console.error(
      "Delete role API error:",
      error
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
      { status: 500 }
    );
  }
}