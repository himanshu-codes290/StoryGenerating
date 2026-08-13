import { redisConnection } from "../../config/redisConnection.js";
import type { StreamEvent } from "./streamChannels.js";

export function getTextStreamKey(jobId: string | number): string {
  return `text-stream:${jobId}`;
}

// Reuse the shared ioredis instance (supports both local and Upstash TLS)
export const redisClient = redisConnection;

export async function appendStreamEvent(
  jobId: string | number,
  event: StreamEvent,
): Promise<string | null> {
  return redisClient.xadd(
    getTextStreamKey(jobId),
    "*",
    "event",
    JSON.stringify(event),
  );
}

export async function expireStream(
  jobId: string | number,
  ttlSeconds = 300,
): Promise<void> {
  await redisClient.expire(getTextStreamKey(jobId), ttlSeconds);
}