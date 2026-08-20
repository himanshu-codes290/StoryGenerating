export interface ApiErrorIssue {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  issues?: ApiErrorIssue[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}