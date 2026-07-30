import { AppError } from "./appError.js";


export class groqError extends AppError {
    constructor(message : string) {
        super(message, 403, "GROQ_ERROR")
    }
}