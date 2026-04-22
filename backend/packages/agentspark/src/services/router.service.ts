/**
 * Router Service — AI Provider Routing Engine
 *
 * Selects the best provider for a given model request based on:
 * - Health status
 * - Latency
 * - Cost
 * - Priority
 */

import { query, queryOne } from '../../../shared/lib/database';
import { Provider, Model } from '@tokenspark/domain';

export interface RouteCandidate {
  provider: Provider;
  model: Model;
  score: number;
}

/**
 * Get all available providers for a model slug
 */
export async function getProvidersForModel(
  modelSlug: string
): Promise<(Provider & { model: Model })[]> {
  return query(
    `SELECT p.*, m.*
     FROM providers p
     JOIN models m ON p.id = m.provider_id
     WHERE m.slug = $1 AND m.is_active = true AND p.health_status != 'down'
     ORDER BY p.priority ASC`,
    [modelSlug]
  );
}

/**
 * Score a provider for routing decision
 * Lower score = better choice
 */
function scoreProvider(
  provider: Provider,
  model: Model
): number {
  // Health weight: 0.4
  const healthScore = provider.healthStatus === 'healthy' ? 1 :
                      provider.healthStatus === 'degraded' ? 0.5 : 0;

  // Latency weight: 0.3
  const latencyScore = provider.avgLatencyMs > 0 ?
    Math.max(0, 1 - (provider.avgLatencyMs / 5000)) : 0.5;

  // Cost weight: 0.3
  const avgPrice = (model.inputPricePerMillion + model.outputPricePerMillion) / 2;
  const maxPrice = 100; // $1.00 per million as max reference
  const costScore = Math.max(0, 1 - (avgPrice / maxPrice));

  // Priority weight: 0.0 (used for ordering, not scoring)
  const priorityScore = 1 - (provider.priority / 200);

  return (
    (healthScore * 0.4) +
    (latencyScore * 0.3) +
    (costScore * 0.3) +
    (priorityScore * 0.1)
  );
}

/**
 * Route a request to the best provider
 * Returns sorted list of candidates (best first)
 */
export async function routeRequest(
  modelSlug: string
): Promise<RouteCandidate[]> {
  const candidates = await getProvidersForModel(modelSlug);

  if (candidates.length === 0) {
    throw new Error(`No available providers for model: ${modelSlug}`);
  }

  const scored = candidates.map((c) => ({
    provider: {
      id: c.id,
      slug: c.slug,
      displayName: c.display_name,
      baseUrl: c.base_url,
      healthStatus: c.health_status,
      avgLatencyMs: c.avg_latency_ms,
      successRate: c.success_rate,
      priority: c.priority,
      rateLimitRpm: c.rate_limit_rpm,
      rateLimitTpm: c.rate_limit_tpm,
      metadata: c.metadata,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    },
    model: {
      id: c.id,
      slug: c.slug,
      displayName: c.display_name,
      providerId: c.provider_id,
      providerModelId: c.provider_model_id,
      inputPricePerMillion: c.input_price_per_million,
      outputPricePerMillion: c.output_price_per_million,
      contextWindow: c.context_window,
      maxOutputTokens: c.max_output_tokens,
      capabilities: c.capabilities,
      isActive: c.is_active,
      metadata: c.metadata,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    },
    score: scoreProvider(
      {
        id: c.id,
        slug: c.slug,
        displayName: c.display_name,
        baseUrl: c.base_url,
        healthStatus: c.health_status,
        avgLatencyMs: c.avg_latency_ms,
        successRate: c.success_rate,
        priority: c.priority,
        rateLimitRpm: c.rate_limit_rpm,
        rateLimitTpm: c.rate_limit_tpm,
        metadata: c.metadata,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      },
      {
        id: c.id,
        slug: c.slug,
        displayName: c.display_name,
        providerId: c.provider_id,
        providerModelId: c.provider_model_id,
        inputPricePerMillion: c.input_price_per_million,
        outputPricePerMillion: c.output_price_per_million,
        contextWindow: c.context_window,
        maxOutputTokens: c.max_output_tokens,
        capabilities: c.capabilities,
        isActive: c.is_active,
        metadata: c.metadata,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }
    ),
  }));

  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Update provider health status
 */
export async function updateProviderHealth(
  providerId: string,
  status: Provider['healthStatus']
): Promise<void> {
  await query(
    `UPDATE providers SET health_status = $1, updated_at = NOW() WHERE id = $2`,
    [status, providerId]
  );
}

/**
 * Record latency for a provider
 */
export async function recordProviderLatency(
  providerId: string,
  latencyMs: number
): Promise<void> {
  // Exponential moving average
  await query(
    `UPDATE providers
     SET avg_latency_ms = (avg_latency_ms * 0.7 + $1 * 0.3)::integer,
         updated_at = NOW()
     WHERE id = $2`,
    [latencyMs, providerId]
  );
}

/**
 * Record success/failure for a provider
 */
export async function recordProviderResult(
  providerId: string,
  success: boolean
): Promise<void> {
  if (success) {
    await query(
      `UPDATE providers
       SET success_rate = LEAST(1.0, success_rate + 0.01),
           updated_at = NOW()
       WHERE id = $1`,
      [providerId]
    );
  } else {
    await query(
      `UPDATE providers
       SET success_rate = GREATEST(0.0, success_rate - 0.05),
           updated_at = NOW()
       WHERE id = $1`,
      [providerId]
    );
  }
}
