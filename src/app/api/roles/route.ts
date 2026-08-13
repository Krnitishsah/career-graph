import { NextRequest, NextResponse } from "next/server";

import {
  getAllRoles,
  getRoleBySlug,
  searchRoles,
  createRole,
} from "../../../lib/services/role.service";

import {
  createRoleSchema,
  roleQuerySchema,
} from "../../../lib/validations/role.validation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validation =
      roleQuerySchema.safeParse(searchParams);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role query",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      search,
      category,
      experienceLevel,
    } = validation.data;

    let roles;

    if (search) {
      roles = await searchRoles(search);
    } else if (category || experienceLevel) {
      roles = await getAllRoles({
        category,
        experienceLevel,
      });
    } else {
      roles = await getAllRoles();
    }

    return NextResponse.json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
      count: roles.length,
    });
  } catch (error) {
    console.error("Roles API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch roles",
        error:
          error instanceof Error
            ? error.message
            : "Unknown role error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation =
      createRoleSchema.safeParse(body);

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

    const role = await createRole(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Role created successfully",
        data: role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create role API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create role",
        error:
          error instanceof Error
            ? error.message
            : "Unknown role error",
      },
      { status: 500 }
    );
  }
}