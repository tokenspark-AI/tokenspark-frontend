/**
 * Pricing Service — Model Pricing Engine
 *
 * Maps model slugs to pricing, calculates costs,
 * and manages the pricing catalog.
 */

import { query, queryOne } from '../../../shared/lib/database';
import { calculateTokenCost } from '../../../shared/lib/money';
import { Model, Provider } from '@tokenspark/domain';

export interface CostEstimate {
  modelSlug: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
}

/**
 * Get model by slug
 */
export async function getModelBySlug(slug: string): Promise<(Model & { provider: Provider }) | null> {
  const result = await queryOne(
    `SELECT m.*, p.slug as provider_slug, p.display_name as provider_name,
            p.base_url as provider_base_url, p.health_status as provider_health
     FROM models m
     JOIN providers p ON m.provider_id = p.id
     WHERE m.slug = $1 AND m.is_active = true`,
    [slug]
  );

  if (!result) return null;

  return {
    ...result,
    provider: {
      id: result.provider_id,
      slug: result.provider_slug,
      displayName: result.provider_name,
      baseUrl: result.provider_base_url,
      healthStatus: result.provider_health,
    },
  };
}

/**
 * List all available models
 */
export async function listActiveModels(): Promise<Model[]> {
  return query(
    `SELECT * FROM models WHERE is_active = true ORDER BY slug`
  );
}

/**
 * Calculate cost for a request
 */
export function calculateCost(
  model: Model,
  inputTokens: number,
  outputTokens: number
): CostEstimate {
  const inputCost = calculateTokenCost(inputTokens, model.inputPricePerMillion);
  const outputCost = calculateTokenCost(outputTokens, model.outputPricePerMillion);

  return {
    modelSlug: model.slug,
    inputTokens,
    outputTokens,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    currency: 'USD',
  };
}

/**
 * Estimate cost for a request (before execution)
 * Uses input token count only; output is estimated at 2x input
 */
export function estimateCost(
  model: Model,
  inputTokens: number
): CostEstimate {
  const estimatedOutputTokens = Math.min(
    inputTokens * 2,
    model.maxOutputTokens || 4096
  );

  return calculateCost(model, inputTokens, estimatedOutputTokens);
}

/**
 * Get pricing for all active models
 */
export async function getPricingCatalog(): Promise<any[]> {
  return query(
    `SELECT m.slug, m.display_name, m.input_price_per_million,
            m.output_price_per_million, m.context_window,
            m.max_output_tokens, m.capabilities,
            p.slug as provider_slug, p.display_name as provider_name
     FROM models m
     JOIN providers p ON m.provider_id = p.id
     WHERE m.is_active = true
     ORDER BY m.slug`
  );
}
