/**
 * Executor Service — AI Request Execution
 *
 * Executes AI requests against provider APIs with fallback support.
 */

import { decrypt } from '../../../shared/lib/crypto';
import { Provider, Model } from '@tokenspark/domain';
import { query, queryOne, transaction } from '../../../shared/lib/database';
import { recordProviderLatency, recordProviderResult } from './router.service';

export interface ExecutionRequest {
  provider: Provider;
  model: Model;
  requestBody: any;
  timeoutMs?: number;
}

export interface ExecutionResult {
  response: any;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  provider: string;
}

/**
 * Execute a request against a provider API
 */
async function executeProviderRequest(
  provider: Provider,
  model: Model,
  requestBody: any,
  timeoutMs: number = 30000
): Promise<{ response: any; latencyMs: number }> {
  const startTime = Date.now();

  // Decrypt API key
  const apiKey = decrypt(provider.apiKeyEncrypted || '');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${provider.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...requestBody,
        model: model.providerModelId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Provider ${provider.slug} returned ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    return { response: data, latencyMs };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/**
 * Execute with fallback support
 * Tries providers in order until one succeeds
 */
export async function executeWithFallback(
  request: ExecutionRequest,
  fallbackProviders: Array<{ provider: Provider; model: Model }>
): Promise<ExecutionResult> {
  const candidates = [{ provider: request.provider, model: request.model }, ...fallbackProviders];

  let lastError: Error | null = null;

  for (let i = 0; i < candidates.length; i++) {
    const { provider, model } = candidates[i];

    try {
      const { response, latencyMs } = await executeProviderRequest(
        provider,
        model,
        request.requestBody,
        request.timeoutMs
      );

      // Record success
      await recordProviderLatency(provider.id, latencyMs);
      await recordProviderResult(provider.id, true);

      // Extract token usage
      const usage = response.usage || { prompt_tokens: 0, completion_tokens: 0 };

      return {
        response,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        latencyMs,
        provider: provider.slug,
      };
    } catch (error) {
      lastError = error as Error;
      await recordProviderResult(provider.id, false);

      // Update request tracking
      if (i > 0) {
        // Fallback was used
      }

      console.warn(`Provider ${provider.slug} failed, trying fallback...`, error);
    }
  }

  throw lastError || new Error('All providers failed');
}

/**
 * Store API request record
 */
export async function storeApiRequest(params: {
  userId: string;
  apiKeyId: string;
  modelSlug: string;
  providerSlug: string;
  endpoint: string;
  requestBodyHash: string;
  responseStatus: number;
  responseTimeMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  fallbackUsed: boolean;
  status: 'completed' | 'failed' | 'timeout';
  errorMessage?: string;
}): Promise<string> {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO api_requests (
      user_id, api_key_id, model_slug, provider_slug, endpoint,
      request_body_hash, response_status, response_time_ms,
      prompt_tokens, completion_tokens, total_tokens,
      fallback_used, status, error_message, completed_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
    RETURNING id`,
    [
      params.userId,
      params.apiKeyId,
      params.modelSlug,
      params.providerSlug,
      params.endpoint,
      params.requestBodyHash,
      params.responseStatus,
      params.responseTimeMs,
      params.promptTokens,
      params.completionTokens,
      params.totalTokens,
      params.fallbackUsed,
      params.status,
      params.errorMessage || null,
    ]
  );

  return result!.id;
}
