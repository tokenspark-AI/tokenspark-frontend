/**
 * Orchestration Service — Main Request Flow
 *
 * This is the heart of TokenSpark. It orchestrates the complete
 * request lifecycle:
 *
 * 1. Auth & Rate Limit
 * 2. Fraud Screen
 * 3. Estimate Cost
 * 4. Reserve Funds
 * 5. Route Request (AgentSpark)
 * 6. Execute (AgentSpark)
 * 7. Calculate Actual Cost
 * 8. Finalize Ledger Entry
 * 9. Release/Charge Reserved Funds
 * 10. Calculate Commissions
 * 11. Return Response
 */

import { createHash } from 'crypto';
import { getModelBySlug, calculateCost, estimateCost, recordUsage } from '../../billing/src/services/pricing.service';
import { routeRequest, RouteCandidate } from '../../agentspark/src/services/router.service';
import { executeWithFallback, storeApiRequest } from '../../agentspark/src/services/executor.service';
import { reserveFunds, chargeFunds, releaseFunds, getWallet, creditFunds } from '../../ledger/src/services/wallet.service';
import { createTransaction } from '../../ledger/src/services/ledger.service';
import { calculateCommissions } from '../../distribution/src/services/commission.service';
import { checkFraud, recordFraudEvent } from '../../../shared/lib/fraud';
import { checkRateLimit, checkTokenLimit } from '../../../shared/lib/rate-limiter';

export interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  [key: string]: any;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  _tokenspark: {
    cost: number;
    currency: string;
    provider: string;
    latency_ms: number;
  };
}

export async function handleChatCompletion(
  request: ChatCompletionRequest,
  userId: string,
  apiKeyId: string,
  apiKeyTier: string,
  ipAddress: string,
  userAgent: string
): Promise<ChatCompletionResponse> {
  // ==========================================
  // Step 1: Rate Limit Check
  // ==========================================
  const rlResult = await checkRateLimit(`user:${userId}`, apiKeyTier);
  if (!rlResult.allowed) {
    await recordFraudEvent({
      userId,
      apiKeyId,
      eventType: 'rate_limit_exceeded',
      severity: 'low',
      description: `Rate limit exceeded: ${rlResult.limit} rpm`,
    });
    throw new Error(`Rate limit exceeded. Retry after ${rlResult.retryAfter}s`);
  }

  // ==========================================
  // Step 2: Fraud Detection
  // ==========================================
  const fraudResult = await checkFraud(userId, apiKeyId, ipAddress, request.model);
  if (fraudResult.isBlocked) {
    await recordFraudEvent({
      userId,
      apiKeyId,
      eventType: 'pattern_match',
      severity: 'critical',
      description: `Request blocked by fraud detection. Risk score: ${fraudResult.riskScore}`,
      evidence: { flags: fraudResult.flags },
      riskScore: fraudResult.riskScore,
    });
    throw new Error('Request blocked: security policy violation');
  }

  // ==========================================
  // Step 3: Get Model & Calculate Estimated Cost
  // ==========================================
  const model = await getModelBySlug(request.model);
  if (!model) {
    throw new Error(`Model not found: ${request.model}`);
  }

  // Estimate tokens from input
  const estimatedInputTokens = estimateInputTokens(request.messages);
  const costEstimate = estimateCost(model, estimatedInputTokens);

  // ==========================================
  // Step 4: Check Balance & Reserve Funds
  // ==========================================
  const available = await getWallet(userId);
  if (!available || (available.balance - available.reservedBalance) < costEstimate.totalCost) {
    throw new Error(
      `Insufficient balance. Required: ${costEstimate.totalCost} cents, Available: ${available ? available.balance - available.reservedBalance : 0} cents`
    );
  }

  await reserveFunds(userId, costEstimate.totalCost);

  // ==========================================
  // Step 5: Route Request (AgentSpark)
  // ==========================================
  const candidates = await routeRequest(request.model);
  const primary = candidates[0];
  const fallbacks = candidates.slice(1);

  // ==========================================
  // Step 6: Execute with Fallback
  // ==========================================
  const requestBody = {
    messages: request.messages,
    temperature: request.temperature ?? 1,
    max_tokens: request.max_tokens,
  };

  let executionResult: Awaited<ReturnType<typeof executeWithFallback>>;

  try {
    executionResult = await executeWithFallback(
      {
        provider: primary.provider,
        model: primary.model,
        requestBody,
      },
      fallbacks.map((c) => ({ provider: c.provider, model: c.model }))
    );
  } catch (error) {
    // Release reserved funds on failure
    await releaseFunds(userId, costEstimate.totalCost);

    // Store failed request
    await storeApiRequest({
      userId,
      apiKeyId,
      modelSlug: request.model,
      providerSlug: primary.provider.slug,
      endpoint: '/v1/chat/completions',
      requestBodyHash: hashRequestBody(requestBody),
      responseStatus: 502,
      responseTimeMs: 0,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      fallbackUsed: true,
      status: 'failed',
      errorMessage: (error as Error).message,
    });

    throw error;
  }

  // ==========================================
  // Step 7: Calculate Actual Cost
  // ==========================================
  const actualCost = calculateCost(
    model,
    executionResult.inputTokens,
    executionResult.outputTokens
  );

  // ==========================================
  // Step 8: Charge Funds & Create Ledger Entry
  // ==========================================
  const difference = actualCost.totalCost - costEstimate.totalCost;

  if (difference > 0) {
    // Actual cost higher than estimate: charge extra
    await chargeFunds(userId, costEstimate.totalCost);
    if (difference > 0) {
      // Deduct additional amount from balance
      const wallet = await getWallet(userId);
      if (wallet && (wallet.balance - wallet.reservedBalance) >= difference) {
        // Create additional ledger entry for the extra charge
        await createTransaction({
          idempotencyKey: `extra_charge_${Date.now()}_${userId}`,
          userId,
          totalAmount: difference,
          currency: 'USD',
          type: 'charge',
          description: 'Additional token usage charge',
          entries: [
            {
              entryType: 'debit',
              accountType: 'user_wallet',
              accountId: userId,
              amount: difference,
              currency: 'USD',
              referenceType: 'api_call',
              description: 'Extra token usage',
            },
            {
              entryType: 'credit',
              accountType: 'system_revenue',
              accountId: userId,
              amount: Math.floor(difference * 0.3), // 30% platform fee
              currency: 'USD',
              referenceType: 'api_call',
              description: 'Platform revenue',
            },
            {
              entryType: 'credit',
              accountType: 'provider_payable',
              accountId: userId,
              amount: Math.floor(difference * 0.7), // 70% to provider
              currency: 'USD',
              referenceType: 'api_call',
              description: 'Provider payment',
            },
          ],
        });
      }
    }
  } else {
    // Actual cost lower or equal: charge and release difference
    await chargeFunds(userId, actualCost.totalCost);
    const refundAmount = costEstimate.totalCost - actualCost.totalCost;
    if (refundAmount > 0) {
      await releaseFunds(userId, refundAmount);
    }
  }

  // Create main ledger transaction
  const ledgerTxn = await createTransaction({
    idempotencyKey: `api_call_${executionResult.provider}_${Date.now()}`,
    userId,
    totalAmount: actualCost.totalCost,
    currency: 'USD',
    type: 'charge',
    description: `API call to ${request.model} via ${executionResult.provider}`,
    metadata: {
      model: request.model,
      provider: executionResult.provider,
      inputTokens: executionResult.inputTokens,
      outputTokens: executionResult.outputTokens,
      latencyMs: executionResult.latencyMs,
    },
    entries: [
      {
        entryType: 'debit',
        accountType: 'user_wallet',
        accountId: userId,
        amount: actualCost.totalCost,
        currency: 'USD',
        referenceType: 'api_call',
        description: `API call charge for ${request.model}`,
      },
      {
        entryType: 'credit',
        accountType: 'system_revenue',
        accountId: userId,
        amount: Math.floor(actualCost.totalCost * 0.3),
        currency: 'USD',
        referenceType: 'api_call',
        description: 'Platform revenue (30%)',
      },
      {
        entryType: 'credit',
        accountType: 'provider_payable',
        accountId: userId,
        amount: Math.floor(actualCost.totalCost * 0.7),
        currency: 'USD',
        referenceType: 'api_call',
        description: 'Provider payment (70%)',
      },
    ],
  });

  // ==========================================
  // Step 9: Record Usage
  // ==========================================
  await recordUsage(
    userId,
    request.model,
    executionResult.inputTokens,
    executionResult.outputTokens,
    actualCost.totalCost
  );

  // ==========================================
  // Step 10: Store API Request
  // ==========================================
  await storeApiRequest({
    userId,
    apiKeyId,
    modelSlug: request.model,
    providerSlug: executionResult.provider,
    endpoint: '/v1/chat/completions',
    requestBodyHash: hashRequestBody(requestBody),
    responseStatus: 200,
    responseTimeMs: executionResult.latencyMs,
    promptTokens: executionResult.inputTokens,
    completionTokens: executionResult.outputTokens,
    totalTokens: executionResult.inputTokens + executionResult.outputTokens,
    fallbackUsed: fallbacks.length > 0,
    status: 'completed',
  });

  // ==========================================
  // Step 11: Calculate Commissions
  // ==========================================
  try {
    await calculateCommissions(
      userId,
      ledgerTxn.id,
      actualCost.totalCost
    );
  } catch (err) {
    // Commission calculation shouldn't block the response
    console.error('Commission calculation failed:', err);
  }

  // ==========================================
  // Step 12: Build Response
  // ==========================================
  const choice = executionResult.response.choices?.[0];

  return {
    id: `ts_${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: request.model,
    choices: [
      {
        index: 0,
        message: {
          role: choice?.message?.role || 'assistant',
          content: choice?.message?.content || '',
        },
        finish_reason: choice?.finish_reason || 'stop',
      },
    ],
    usage: {
      prompt_tokens: executionResult.inputTokens,
      completion_tokens: executionResult.outputTokens,
      total_tokens: executionResult.inputTokens + executionResult.outputTokens,
    },
    _tokenspark: {
      cost: actualCost.totalCost,
      currency: 'USD',
      provider: executionResult.provider,
      latency_ms: executionResult.latencyMs,
    },
  };
}

/**
 * Estimate input token count from messages
 * Simple approximation: ~4 chars per token
 */
function estimateInputTokens(messages: Array<{ role: string; content: string }>): number {
  const totalChars = messages.reduce((sum, m) => sum + m.content.length + m.role.length, 0);
  return Math.ceil(totalChars / 4);
}

function hashRequestBody(body: any): string {
  return createHash('sha256').update(JSON.stringify(body)).digest('hex');
}
