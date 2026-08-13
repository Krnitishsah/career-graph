// ============================================================
// API TYPES
// ============================================================

// ============================================================
// BASE API RESPONSE
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============================================================
// SUCCESS RESPONSE
// ============================================================

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

// ============================================================
// ERROR RESPONSE
// ============================================================

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// ============================================================
// PAGINATION
// ============================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: Pagination;
}

// ============================================================
// PAGINATED QUERY
// ============================================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

// ============================================================
// API REQUEST
// ============================================================

export interface ApiRequest<T = unknown> {
  data: T;
}

// ============================================================
// API ERROR
// ============================================================

export interface ApiError {
  message: string;
  statusCode?: number;
  code?: string;
  details?: unknown;
}

// ============================================================
// API RESULT
// ============================================================

export type ApiResult<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

// ============================================================
// LIST RESULT
// ============================================================

export interface ApiListResponse<T> {
  success: true;
  message: string;
  data: T[];
  count: number;
}

// ============================================================
// SEARCH RESPONSE
// ============================================================

export interface ApiSearchResponse<T> {
  success: true;
  message: string;
  data: T[];
  count: number;
  search: string;
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface ApiDeleteResponse {
  success: true;
  message: string;
  data: {
    id: string;
    deleted: boolean;
  };
}

// ============================================================
// API STATUS
// ============================================================

export interface ApiStatusResponse {
  success: boolean;
  message: string;
  status: string;
}

// ============================================================
// HTTP METHODS
// ============================================================

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

// ============================================================
// HTTP STATUS
// ============================================================

export type HttpStatus =
  | 200
  | 201
  | 204
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 500;