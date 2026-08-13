// ============================================================
// ERROR HANDLER
// ============================================================

import {
  badRequestResponse,
  conflictResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  validationErrorResponse,
} from "./api-response";

// ============================================================
// ERROR TYPES
// ============================================================

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(
    message: string,
    statusCode = 500,
    code?: string
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(
      this,
      new.target.prototype
    );
  }
}

// ============================================================
// COMMON APPLICATION ERRORS
// ============================================================

export class BadRequestError extends AppError {
  constructor(
    message = "Invalid request"
  ) {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized"
  ) {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = "Forbidden"
  ) {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found"
  ) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(
    message = "Resource already exists"
  ) {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed"
  ) {
    super(message, 422, "VALIDATION_ERROR");
  }
}

// ============================================================
// UNKNOWN ERROR MESSAGE
// ============================================================

export function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (error as { message: unknown }).message
    );
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

// ============================================================
// ERROR STATUS
// ============================================================

export function getErrorStatus(
  error: unknown
): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error
  ) {
    const statusCode = Number(
      (error as { statusCode: unknown })
        .statusCode
    );

    if (
      Number.isInteger(statusCode) &&
      statusCode >= 400 &&
      statusCode <= 599
    ) {
      return statusCode;
    }
  }

  return 500;
}

// ============================================================
// DATABASE ERROR DETECTION
// ============================================================

function isNeo4jError(
  error: unknown
): boolean {
  if (!error) {
    return false;
  }

  const value = error as {
    name?: string;
    code?: string;
  };

  return (
    value.name === "Neo4jError" ||
    Boolean(
      value.code?.startsWith("Neo.")
    )
  );
}

// ============================================================
// ERROR LOGGING
// ============================================================

export function logError(
  error: unknown,
  context?: string
): void {
  if (context) {
    console.error(
      `[${context}]`,
      error
    );
    return;
  }

  console.error(error);
}

// ============================================================
// HANDLE ERROR
// ============================================================

export function handleError(
  error: unknown,
  context?: string
) {
  logError(error, context);

  // ----------------------------------------------------------
  // Application error
  // ----------------------------------------------------------

  if (error instanceof AppError) {
    switch (error.statusCode) {
      case 400:
        return badRequestResponse(
          error.message
        );

      case 401:
        return unauthorizedResponse(
          error.message
        );

      case 403:
        return forbiddenResponse(
          error.message
        );

      case 404:
        return notFoundResponse(
          error.message
        );

      case 409:
        return conflictResponse(
          error.message
        );

      case 422:
        return validationErrorResponse(
          error.message
        );

      default:
        return serverErrorResponse(
          error,
          error.message
        );
    }
  }

  // ----------------------------------------------------------
  // Neo4j / CognoDB errors
  // ----------------------------------------------------------

  if (isNeo4jError(error)) {
    return serverErrorResponse(
      error,
      "Database operation failed"
    );
  }

  // ----------------------------------------------------------
  // Standard Error
  // ----------------------------------------------------------

  if (error instanceof Error) {
    return serverErrorResponse(
      error,
      error.message
    );
  }

  // ----------------------------------------------------------
  // Unknown error
  // ----------------------------------------------------------

  return serverErrorResponse(
    error,
    "Internal server error"
  );
}

// ============================================================
// ASYNC ROUTE HANDLER
// ============================================================

export function asyncHandler<
  T extends (
    request: Request,
    ...args: any[]
  ) => Promise<Response>
>(handler: T) {
  return async (
    request: Request,
    ...args: any[]
  ): Promise<Response> => {
    try {
      return await handler(
        request,
        ...args
      );
    } catch (error) {
      return handleError(
        error,
        `${request.method} ${request.url}`
      );
    }
  };
}