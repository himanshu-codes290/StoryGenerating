import { z } from "zod";

export const StoryBodySchema = z.object({
  prompt: z
    .string({ required_error: "Prompt is required" })
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt must be at most 2000 characters"),
});

export type StoryBody = z.infer<typeof StoryBodySchema>;
