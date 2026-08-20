import type { ApiResponse, ApiErrorIssue } from "@repo/types";

export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  };
}

export function errorResponse(
  message: string,
  code?: string,
  issues?: ApiErrorIssue[]
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      message,
      ...(code !== undefined && { code }),
      ...(issues !== undefined && { issues }),
    },
  };
}