// worker.ts
import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redisConnection.js';
import { QUEUE_NAME } from '../infrastructure/bullmq/bullmq.storyQueue.js';
import type { StoryJobData, StoryJobResult } from '../types/storyJob.type.js';
import { generateStory } from '../services/generateStory.service.js';


export const storyWorker = new Worker<StoryJobData, StoryJobResult>(
  QUEUE_NAME,
  async (job: Job<StoryJobData, StoryJobResult>) => {
    const prompt  = job.data.prompt;
    const storyResult = await generateStory({prompt});
    return { story: storyResult };
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);
