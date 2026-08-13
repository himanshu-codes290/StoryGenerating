// redisConnection.ts
// Supports both local Redis (host/port) and Upstash cloud Redis (rediss:// URL).
// Set REDIS_URL in your .env to switch to Upstash; otherwise falls back to local.

import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL;

  if (url) {
    // Upstash / any cloud Redis with TLS (rediss://) or plain (redis://) URL
    return new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,   // Required for Upstash
      lazyConnect: false,
    });
  }

  // Local Redis fallback
  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

// Single shared ioredis instance reused by BullMQ Queue, QueueEvents, and Workers.
// BullMQ accepts an ioredis instance directly as the `connection` option.
export const redisConnection = createRedisClient();