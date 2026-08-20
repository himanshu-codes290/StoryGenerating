import { z } from "zod";

export const TTSProviderEnum = z.enum(["deepgram", "elevenlabs", "google_tts"], {
  errorMap: () => ({
    message: "Provider must be one of: deepgram, elevenlabs, google_tts",
  }),
});

export const TTSBodySchema = z.object({
  text: z
    .string({ required_error: "Text is required" })
    .min(1, "Text cannot be empty")
    .max(2500, "Text must be at most 2500 characters"),

  provider: TTSProviderEnum,

  language: z
    .string({ required_error: "Language is required" })
    .min(1, "Language cannot be empty"),

  voice: z.string().optional(),
});

export type TTSBody = z.infer<typeof TTSBodySchema>;
