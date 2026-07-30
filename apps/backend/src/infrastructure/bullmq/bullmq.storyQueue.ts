// queue.ts
import { Queue, QueueEvents } from 'bullmq';
import { redisConnection } from '../../config/redisConnection.js';
import type { StoryJobData, StoryJobResult } from '../../types/storyJob.type.js';

export const QUEUE_NAME = 'story-generation';

export const storyQueue = new Queue<StoryJobData, StoryJobResult>(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 86400 },
  },
});

// Used by Fastify to listen for job completions in real time
export const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: redisConnection,
});