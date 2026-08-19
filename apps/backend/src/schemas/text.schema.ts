import { z } from "zod";

export const TextBodySchema = z.object({
  text: z
    .string({ required_error: "Text is required" })
    .min(1, "Text cannot be empty"),

  task: z
    .string({ required_error: "Task is required" })
    .min(1, "Task cannot be empty"),

  tone: z
    .string({ required_error: "Tone is required" })
    .min(1, "Tone cannot be empty"),

  provider: z.string().optional(),
});

export type TextBody = z.infer<typeof TextBodySchema>;
