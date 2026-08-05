import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redisConnection.js";
import { TEXT_QUEUE_NAME } from "../infrastructure/bullmq/bullmq.textGeneration.queue.js";
import type { TextGenerationJobData, TextGenerationJobResult } from "../types/generateTextJob.types.js";

import { processTextGenerationJob } from "../services/processTextGeneration.service.js";
import type {StreamEvent } from "../infrastructure/redis/streamChannels.js";
import { appendStreamEvent , expireStream} from "../infrastructure/redis/textStream.redis.js"

export const textGeneratorWorker = new Worker<TextGenerationJobData, TextGenerationJobResult>(TEXT_QUEUE_NAME, 
    async (job : Job<TextGenerationJobData>) => {
    console.log(`Processing job ${job.id}`);

    return await processTextGenerationJob(job.data, async (stream : StreamEvent) => {
      // console.log(token)
      appendStreamEvent(job.id!, stream)
      if (stream.type === "complete") {
            await expireStream(job.id!, 300);
        }
    });
  },
  {
    connection: redisConnection,
    concurrency: 3
  }

);

textGeneratorWorker.on("completed", (job) => {
  console.log(`Job ${job?.id} completed`);
});

textGeneratorWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});

textGeneratorWorker.on("error", (error) => {
  console.error("Worker error:", error);
});