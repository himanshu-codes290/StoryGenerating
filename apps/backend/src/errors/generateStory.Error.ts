import { AppError } from "./appError.js";

export class StoryGenerationError extends AppError {
  constructor() {
    super(
      "Unable to generate the story at the moment.",
      500,
      "STORY_GENERATION_FAILED"
    );
  }
}


export class groqError extends AppError {
    constructor(message : string) {
        super(message, 403, "GROQ_ERROR")
    }
}