import { z } from "zod";

export const JobIdParamsSchema = z.object({
  jobId: z
    .string({ required_error: "Job ID is required" })
    .min(1, "Job ID cannot be empty"),
});


export const AudioKeyParamsSchema = z.object({
  key: z
    .string({ required_error: "Audio key is required" })
    .min(1, "Audio key cannot be empty"),
});

export type JobIdParams = z.infer<typeof JobIdParamsSchema>;
export type AudioKeyParams = z.infer<typeof AudioKeyParamsSchema>;
