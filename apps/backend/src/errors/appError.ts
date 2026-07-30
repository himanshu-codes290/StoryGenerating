export class AppError extends Error{
    constructor(
        public readonly message : string,
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
