// queue.ts
import { Queue, QueueEvents } from 'bullmq';
import { redisConnection } from '../../config/redisConnection.js';
import type { TextGenerationJobData, TextGenerationJobResult } from '../../types/generateTextJob.types.js';

export const TEXT_QUEUE_NAME = 'text-generation';
export const GENERATE_TEXT_JOB = "generate-text";


export const textQueue = new Queue<TextGenerationJobData, TextGenerationJobResult>(TEXT_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

// Used by Fastify to listen for job completions in real time
export const queueEvents = new QueueEvents(TEXT_QUEUE_NAME, {
  connection: redisConnection,
});