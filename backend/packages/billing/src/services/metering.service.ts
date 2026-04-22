/**
 * Metering Service — Token Usage Tracking
 *
 * Tracks and aggregates token usage per user, per model, per day.
 */

import { query, queryOne, transaction } from '../../../shared/lib/database';

export interface UsageRecord {
  userId: string;
  date: string;
  modelSlug: string;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
}

/**
 * Record usage for an API call
 */
export async function recordUsage(
  userId: string,
  modelSlug: string,
  inputTokens: number,
  outputTokens: number,
  cost: number
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  await transaction(async (client) => {
    const result = await client.query(
      `INSERT INTO usage_daily (user_id, date, model_slug, request_count,
        total_input_tokens, total_output_tokens, total_cost)
       VALUES ($1, $2, $3, 1, $4, $5, $6)
       ON CONFLICT (user_id, date, model_slug)
       DO UPDATE SET
         request_count = usage_daily.request_count + 1,
         total_input_tokens = usage_daily.total_input_tokens + $4,
         total_output_tokens = usage_daily.total_output_tokens + $5,
         total_cost = usage_daily.total_cost + $6`,
      [userId, today, modelSlug, inputTokens, outputTokens, cost]
    );
  });
}

/**
 * Get usage summary for a user
 */
export async function getUserUsageSummary(
  userId: string,
  days: number = 30
): Promise<UsageRecord[]> {
  return query(
    `SELECT * FROM usage_daily
     WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '${days} days'
     ORDER BY date DESC`,
    [userId]
  );
}

/**
 * Get current month usage
 */
export async function getCurrentMonthUsage(userId: string): Promise<{
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
}> {
  const result = await queryOne(
    `SELECT COALESCE(SUM(request_count), 0) as total_requests,
            COALESCE(SUM(total_input_tokens), 0) as total_input_tokens,
            COALESCE(SUM(total_output_tokens), 0) as total_output_tokens,
            COALESCE(SUM(total_cost), 0) as total_cost
     FROM usage_daily
     WHERE user_id = $1
       AND date >= DATE_TRUNC('month', CURRENT_DATE)`,
    [userId]
  );

  return {
    totalRequests: parseInt(result?.total_requests || '0'),
    totalInputTokens: parseInt(result?.total_input_tokens || '0'),
    totalOutputTokens: parseInt(result?.total_output_tokens || '0'),
    totalCost: parseInt(result?.total_cost || '0'),
  };
}
