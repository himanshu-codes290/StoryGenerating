import { Redis, type RedisOptions } from "ioredis";
import { redisConnection} from "../../config/redisConnection.js";
import type { StreamEvent } from "./streamChannels.js";

export function getTextStreamKey(jobId: string | number): string {
  return `text-stream:${jobId}`;
}




export const redisClient = new Redis({
    ...redisConnection,
    maxRetriesPerRequest: undefined,
}as RedisOptions);

export async function appendStreamEvent(
  jobId: string | number,
  event: StreamEvent,
): Promise<string  | null> {
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