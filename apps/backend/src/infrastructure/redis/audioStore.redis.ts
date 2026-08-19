import { redisConnection } from "../../config/redisConnection.js";

const redisClient = redisConnection;

export function getAudioKey(jobId: string): string {
  return `audio:${jobId}`;
}

/**
 * Stores the complete audio buffer in Redis with a single SET command.
 * @param key    Redis key (use getAudioKey)
 * @param audio  Full audio Buffer
 * @param ttlSeconds  Time-to-live in seconds (default 1 hour)
 */
export async function storeAudio(
  key: string,
  audio: Buffer,
  ttlSeconds = 3600,
): Promise<void> {
  await redisClient.set(key, audio, "EX", ttlSeconds);
}

/**
 * Retrieves the full audio buffer from Redis with a single GET command.
 * Returns null if the key doesn't exist or has expired.
 */
export async function getAudio(key: string): Promise<Buffer | null> {
  return redisClient.getBuffer(key);
}

/**
 * Checks whether an audio key exists in Redis.
 */
export async function audioExists(key: string): Promise<boolean> {
  const count = await redisClient.exists(key);
  return count > 0;
}
