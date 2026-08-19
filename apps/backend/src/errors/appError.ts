import type { ZodError, ZodIssue } from "zod";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

/**
 * Wraps a ZodError into an AppError.
 * Formats each issue as  "field.path: message"  joined by "; ".
 * Carries the raw `issues` array so the error handler can surface field-level details.
 */
export class ZodValidationError extends AppError {
  public readonly issues: ZodIssue[];

  constructor(error: ZodError) {
    const message = error.issues
      .map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join(".") : "body";
        return `${field}: ${issue.message}`;
      })
      .join("; ");

    super(message, 400, "VALIDATION_ERROR");
    this.issues = error.issues;
  }
}
