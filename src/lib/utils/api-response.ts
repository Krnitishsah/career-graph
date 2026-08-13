// ============================================================
// API RESPONSE HELPERS
// ============================================================

import { NextResponse } from "next/server";

// ============================================================
// TYPES
// ============================================================

interface SuccessResponseOptions {
  status?: number;
  message?: string;
}

interface ErrorResponseOptions {
  status?: number;
  message?: string;
  error?: unknown;
}

interface PaginatedResponseOptions {
  page: number;
  limit: number;
  total: number;
}

// ============================================================
// SUCCESS RESPONSE
// ============================================================

export function successResponse<T>(
  data: T,
  options: SuccessResponseOptions = {}
) {
  const {
    status = 200,
    message = "Request successful",
  } = options;

  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// ============================================================
// CREATED RESPONSE
// ============================================================

export function createdResponse<T>(
  data: T,
  message = "Resource created successfully"
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: 201 }
  );
}

// ============================================================
// NO CONTENT RESPONSE
// ============================================================

export function noContentResponse() {
  return new NextResponse(null, {
    status: 204,
  });
}

// ============================================================
// ERROR RESPONSE
// ============================================================

export function errorResponse(
  options: ErrorResponseOptions = {}
) {
  const {
    status = 500,
    message = "Something went wrong",
    error,
  } = options;

  const response: {
    success: false;
    message: string;
    error?: string;
  } = {
    success: false,
    message,
  };

  if (error) {
    response.error =
      error instanceof Error
        ? error.message
        : String(error);
  }

  return NextResponse.json(
    response,
    { status }
  );
}

// ============================================================
// BAD REQUEST
// ============================================================

export function badRequestResponse(
  message = "Invalid request"
) {
  return errorResponse({
    status: 400,
    message,
  });
}

// ============================================================
// UNAUTHORIZED
// ============================================================

export function unauthorizedResponse(
  message = "Unauthorized"
) {
  return errorResponse({
    status: 401,
    message,
  });
}

// ============================================================
// FORBIDDEN
// ============================================================

export function forbiddenResponse(
  message = "Forbidden"
) {
  return errorResponse({
    status: 403,
    message,
  });
}

// ============================================================
// NOT FOUND
// ============================================================

export function notFoundResponse(
  message = "Resource not found"
) {
  return errorResponse({
    status: 404,
    message,
  });
}

// ============================================================
// CONFLICT
// ============================================================

export function conflictResponse(
  message = "Resource already exists"
) {
  return errorResponse({
    status: 409,
    message,
  });
}

// ============================================================
// VALIDATION ERROR
// ============================================================

export function validationErrorResponse(
  message = "Validation failed"
) {
  return errorResponse({
    status: 422,
    message,
  });
}

// ============================================================
// SERVER ERROR
// ============================================================

export function serverErrorResponse(
  error?: unknown,
  message = "Internal server error"
) {
  return errorResponse({
    status: 500,
    message,
    error,
  });
}

// ============================================================
// PAGINATED RESPONSE
// ============================================================

export function paginatedResponse<T>(
  data: T[],
  options: PaginatedResponseOptions
) {
  const {
    page,
    limit,
    total,
  } = options;

  const totalPages =
    limit > 0
      ? Math.ceil(total / limit)
      : 0;

  return NextResponse.json(
    {
      success: true,
      message: "Request successful",
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },
    },
    { status: 200 }
  );
}