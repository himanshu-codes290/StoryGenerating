import type { FastifyError, FastifyInstance } from 'fastify';
import { AppError } from '../errors/appError.js';
import { errorResponse } from './apiResponse.js';

export function errorHandler(app:FastifyInstance)
{
    app.setErrorHandler((error : FastifyError, request, reply) => {

    if(error instanceof AppError){
        return reply
            .status(error.statusCode)
            .send(
                errorResponse(
                    error.message,
                    error.code
                )
            );
    }

    // // 2. Fastify Schema Validation Errors (AJV)
    // if (error.validation) {
    //   return reply
    //     .status(400)
    //     .send(errorResponse(error.message, "VALIDATION_ERROR"));
    // }

    // // 3. Other Fastify Errors with built-in statusCodes (e.g. 404, 413 Body Too Large, etc.)
    // if (error.statusCode && error.statusCode < 500) {
    //   return reply
    //     .status(error.statusCode)
    //     .send(errorResponse(error.message, error.code || "BAD_REQUEST"));
    // }

    request.log.error(error);

    return reply
        .status(500)
        .send(
            errorResponse(
                "Internal server error",
                "INTERNAL_SERVER_ERROR"
            )
        );
});
}