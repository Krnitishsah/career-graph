import { NextRequest, NextResponse } from "next/server";

import {
  getAllRoles,
  searchRoles,
  createRole,
} from "../../../lib/services/role.service";

import {
  createRoleSchema,
  roleQuerySchema,
} from "../../../lib/validations/role.validation";

// ============================================================
// GET ALL / SEARCH / FILTER ROLES
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // --------------------------------------------------------
    // READ QUERY PARAMETERS
    // --------------------------------------------------------

    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    // --------------------------------------------------------
    // VALIDATE QUERY
    // --------------------------------------------------------

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
        { status: 400 },
      );
    }

    const {
      search,
      category,
      experienceLevel,
    } = validation.data;

    let roles;

    // --------------------------------------------------------
    // SEARCH ROLES
    // --------------------------------------------------------

    if (search?.trim()) {
      roles = await searchRoles(
        search.trim(),
      );
    }

    // --------------------------------------------------------
    // FILTER ROLES
    // --------------------------------------------------------

    else if (
      category ||
      experienceLevel
    ) {
      roles = await getAllRoles({
        category,
        experienceLevel,
      });
    }

    // --------------------------------------------------------
    // GET ALL ROLES
    // --------------------------------------------------------

    else {
      roles = await getAllRoles();
    }

    // --------------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Roles fetched successfully",
        data: roles,
        count: roles.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "GET /api/roles error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch roles",
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
// CREATE ROLE
// ============================================================

export async function POST(
  request: NextRequest,
) {
  try {
    // --------------------------------------------------------
    // PARSE REQUEST BODY
    // --------------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------------
    // VALIDATE BODY
    // --------------------------------------------------------

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
        { status: 400 },
      );
    }

    // --------------------------------------------------------
    // CREATE ROLE
    // --------------------------------------------------------

    const role = await createRole(
      validation.data,
    );

    // --------------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "Role created successfully",
        data: role,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/roles error:",
      error,
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
      { status: 500 },
    );
  }
}
