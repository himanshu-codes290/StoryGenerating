// redisConnection.ts
// Supports both local Redis (host/port) and Upstash cloud Redis (rediss:// URL).
// Set REDIS_URL in your .env to switch to Upstash; otherwise falls back to local.

import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

function createRedisClient(): Redis {
  const url = process.env.REDIS_URL;

  // Exponential backoff: 50ms, 100ms, 200ms ... capped at 5s
  const retryStrategy = (times: number): number =>
    Math.min(times * 50, 5000);

  if (url) {
    // Upstash / any cloud Redis with TLS (rediss://) or plain (redis://) URL
    const client = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,   // Required for Upstash
      lazyConnect: false,
      retryStrategy,
      reconnectOnError: () => true, // Always reconnect on error (handles stale connections after hibernation)
    });

    client.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err.message);
    });

    client.on('reconnecting', () => {
      console.log('[Redis] Reconnecting...');
    });

    return client;
  }

  // Local Redis fallback
  const client = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy,
    reconnectOnError: () => true,
  });

  client.on('error', (err: Error) => {
    console.error('[Redis] Connection error:', err.message);
  });

  return client;
}

// Single shared ioredis instance reused by BullMQ Queue, QueueEvents, and Workers.
// BullMQ accepts an ioredis instance directly as the `connection` option.
export const redisConnection = createRedisClient();