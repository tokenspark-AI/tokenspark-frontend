/**
 * Rate Limiter — Redis-based sliding window rate limiting
 *
 * Tiers:
 * - Free: 20 req/min, 40K tokens/min
 * - Standard: 60 req/min, 150K tokens/min
 * - Enterprise: 600 req/min, 2M tokens/min
 */

import { getRedis } from '../../../shared/lib/redis';
import { RateLimitError } from '../../../shared/lib/errors';

export const RATE_LIMIT_TIERS = {
  free: { rpm: 20, tpm: 40_000, burst: 5 },
  standard: { rpm: 60, tpm: 150_000, burst: 15 },
  enterprise: { rpm: 600, tpm: 2_000_000, burst: 100 },
};

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
  resetAt: number;
}

/**
 * Check rate limit for a user
 * Returns rate limit info; throws if exceeded
 */
export async function checkRateLimit(
  key: string,
  tier: string = 'standard'
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_TIERS[tier as keyof typeof RATE_LIMIT_TIERS] || RATE_LIMIT_TIERS.standard;
  const redis = getRedis();

  // Sliding window: current second as window key
  const now = Date.now();
  const windowStart = Math.floor(now / 1000);
  const redisKey = `ratelimit:${key}:${windowStart}`;

  // Atomic increment
  const current = await redis.incr(redisKey);
  await redis.expire(redisKey, 60); // Expire after 60 seconds

  const remaining = Math.max(0, config.rpm - current);
  const retryAfter = current > config.rpm ? 1 : 0;

  if (current > config.rpm) {
    return {
      allowed: false,
      limit: config.rpm,
      remaining: 0,
      retryAfter,
      resetAt: (windowStart + 1) * 1000,
    };
  }

  return {
    allowed: true,
    limit: config.rpm,
    remaining,
    retryAfter: 0,
    resetAt: (windowStart + 1) * 1000,
  };
}

/**
 * Check token rate limit
 */
export async function checkTokenLimit(
  key: string,
  tokenCount: number,
  tier: string = 'standard'
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_TIERS[tier as keyof typeof RATE_LIMIT_TIERS] || RATE_LIMIT_TIERS.standard;
  const redis = getRedis();

  const now = Date.now();
  const windowStart = Math.floor(now / 1000);
  const redisKey = `tokenlimit:${key}:${windowStart}`;

  const current = await redis.incrby(redisKey, tokenCount);
  await redis.expire(redisKey, 60);

  const remaining = Math.max(0, config.tpm - current);

  if (current > config.tpm) {
    return {
      allowed: false,
      limit: config.tpm,
      remaining: 0,
      retryAfter: 1,
      resetAt: (windowStart + 1) * 1000,
    };
  }

  return {
    allowed: true,
    limit: config.tpm,
    remaining,
    retryAfter: 0,
    resetAt: (windowStart + 1) * 1000,
  };
}
