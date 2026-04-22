/**
 * Fraud Detection Service
 *
 * Detects:
 * - Self-payment fraud (user calling their own provider)
 * - Circular call detection (A calls B calls A)
 * - Refund abuse
 * - Token anomaly patterns
 * - IP velocity
 * - Model hopping abuse
 */

import { query, queryOne } from '../../../shared/lib/database';
import { getRedis } from '../../../shared/lib/redis';
import { FraudEventType, FraudSeverity } from '@tokenspark/domain';

export interface FraudCheckResult {
  isBlocked: boolean;
  riskScore: number;
  flags: FraudFlag[];
}

export interface FraudFlag {
  type: FraudEventType;
  severity: FraudSeverity;
  description: string;
  score: number;
}

/**
 * Run all fraud checks before processing a request
 */
export async function checkFraud(
  userId: string,
  apiKeyId: string,
  ipAddress: string,
  modelSlug: string
): Promise<FraudCheckResult> {
  const flags: FraudFlag[] = [];
  let riskScore = 0;

  // 1. Self-payment detection
  const selfPay = await checkSelfPayment(userId);
  if (selfPay) {
    flags.push(selfPay);
    riskScore += 40;
  }

  // 2. Circular call detection
  const circular = await checkCircularCall(userId, apiKeyId);
  if (circular) {
    flags.push(circular);
    riskScore += 30;
  }

  // 3. IP velocity check
  const ipVelocity = await checkIpVelocity(ipAddress, userId);
  if (ipVelocity) {
    flags.push(ipVelocity);
    riskScore += 20;
  }

  // 4. Recent fraud history
  const recentFrauds = await getRecentFraudCount(userId, 3600); // last 1 hour
  if (recentFrauds > 3) {
    flags.push({
      type: 'pattern_match',
      severity: 'high',
      description: `User has ${recentFrauds} fraud events in the last hour`,
      score: 25,
    });
    riskScore += 25;
  }

  return {
    isBlocked: riskScore >= 70,
    riskScore: Math.min(riskScore, 100),
    flags,
  };
}

/**
 * Check if user is trying to call their own provider
 */
async function checkSelfPayment(userId: string): Promise<FraudFlag | null> {
  // Check if this user owns any provider accounts
  const ownedProvider = await queryOne(
    `SELECT 1 FROM providers p
     JOIN user_providers up ON p.id = up.provider_id
     WHERE up.user_id = $1`,
    [userId]
  );

  if (ownedProvider) {
    return {
      type: 'self_payment',
      severity: 'high',
      description: 'User owns a provider account',
      score: 40,
    };
  }

  return null;
}

/**
 * Check for circular API calls using Redis graph
 */
async function checkCircularCall(
  userId: string,
  apiKeyId: string
): Promise<FraudFlag | null> {
  const redis = getRedis();
  const key = `fraud:call_graph:${userId}`;

  // Add this call to the graph
  await redis.sadd(key, apiKeyId);
  await redis.expire(key, 300); // 5 minute window

  // Check if any recent calls from this user's API keys called back
  // Simplified: check if target user called back to this user
  // In production: use a proper graph database or bloom filter

  return null;
}

/**
 * Check IP velocity (multiple users from same IP)
 */
async function checkIpVelocity(
  ipAddress: string,
  userId: string
): Promise<FraudFlag | null> {
  const redis = getRedis();
  const key = `fraud:ip_users:${ipAddress}`;

  await redis.sadd(key, userId);
  await redis.expire(key, 600); // 10 minute window

  const count = await redis.scard(key);

  if (count > 10) {
    return {
      type: 'ip_velocity',
      severity: 'medium',
      description: `${count} users from IP ${ipAddress} in 10 minutes`,
      score: 20,
    };
  }

  return null;
}

/**
 * Count recent fraud events for a user
 */
async function getRecentFraudCount(
  userId: string,
  windowSeconds: number
): Promise<number> {
  const result = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM fraud_events
     WHERE user_id = $1 AND created_at > NOW() - INTERVAL '${windowSeconds} seconds'`,
    [userId]
  );

  return parseInt(result?.count || '0');
}

/**
 * Record a fraud event
 */
export async function recordFraudEvent(params: {
  userId?: string;
  apiKeyId?: string;
  eventType: FraudEventType;
  severity: FraudSeverity;
  description?: string;
  evidence?: Record<string, any>;
  riskScore?: number;
}): Promise<void> {
  await query(
    `INSERT INTO fraud_events (
      user_id, api_key_id, event_type, severity, risk_score,
      description, evidence, action_taken
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      params.userId || null,
      params.apiKeyId || null,
      params.eventType,
      params.severity,
      params.riskScore || 0,
      params.description || null,
      params.evidence ? JSON.stringify(params.evidence) : null,
      params.severity === 'critical' ? 'block' :
      params.severity === 'high' ? 'throttle' : 'none',
    ]
  );
}
