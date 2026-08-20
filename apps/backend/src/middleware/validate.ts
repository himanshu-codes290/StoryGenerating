import type { FastifyReply, FastifyRequest } from "fastify";
import type { ZodSchema } from "zod";
import { ZodValidationError } from "../errors/appError.js";

/**
 * Fastify preHandler factory for validating `request.body` against a Zod schema.
 *
 * Usage:
 *   app.post('/route', { preHandler: [validateBody(MySchema)] }, handler)
 *
 * On success: `request.body` is replaced with the parsed + coerced data.
 * On failure: throws a `ZodValidationError` (caught by the global error handler).
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      throw new ZodValidationError(result.error);
    }
    // Replace body with the validated (and coerced/defaulted) data
    request.body = result.data;
  };
}

/**
 * Fastify preHandler factory for validating `request.params` against a Zod schema.
 *
 * Usage:
 *   app.get('/route/:jobId', { preHandler: [validateParams(JobIdParamsSchema)] }, handler)
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const result = schema.safeParse(request.params);
    if (!result.success) {
      throw new ZodValidationError(result.error);
    }
    request.params = result.data as Record<string, unknown>;
  };
}
