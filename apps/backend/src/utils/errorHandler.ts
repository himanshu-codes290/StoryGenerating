import type { FastifyError, FastifyInstance } from 'fastify';
import { AppError, ZodValidationError } from '../errors/appError.js';
import { errorResponse } from './apiResponse.js';

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {

    // 1. Zod Validation Errors — structured field-level details
    if (error instanceof ZodValidationError) {
      return reply.status(400).send({
        success: false,
        data: null,
        error: {
          message: error.message,
          code: error.code,
          issues: error.issues.map((issue) => ({
            field: issue.path.length > 0 ? issue.path.join(".") : "body",
            message: issue.message,
          })),
        },
      });
    }

    // 2. Generic AppErrors (e.g. ValidationError, business logic errors)
    if (error instanceof AppError) {
      return reply
        .status(error.statusCode)
        .send(errorResponse(error.message, error.code));
    }

    // 3. Fastify schema validation errors (AJV, if any)
    if (error.validation) {
      return reply
        .status(400)
        .send(errorResponse(error.message, 'VALIDATION_ERROR'));
    }

    // 4. Other Fastify errors with built-in statusCodes (404, 413, etc.)
    if (error.statusCode && error.statusCode < 500) {
      return reply
        .status(error.statusCode)
        .send(errorResponse(error.message, error.code ?? 'BAD_REQUEST'));
    }

    request.log.error(error);

    return reply
      .status(500)
      .send(errorResponse('Internal server error', 'INTERNAL_SERVER_ERROR'));
  });
}