import { z } from "zod";

export const JobIdParamsSchema = z.object({
  jobId: z
    .string({ required_error: "Job ID is required" })
    .uuid("Job ID must be a valid UUID"),
});

export const AudioKeyParamsSchema = z.object({
  key: z
    .string({ required_error: "Audio key is required" })
    .min(1, "Audio key cannot be empty"),
});

export type JobIdParams = z.infer<typeof JobIdParamsSchema>;
export type AudioKeyParams = z.infer<typeof AudioKeyParamsSchema>;
