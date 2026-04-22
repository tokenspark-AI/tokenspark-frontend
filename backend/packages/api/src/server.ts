/**
 * TokenSpark API Server
 *
 * Unified API Gateway — the main entry point for all API consumers.
 * Implements OpenAI-compatible API surface.
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { hashApiKey } from '../../../shared/lib/crypto';
import { queryOne } from '../../../shared/lib/database';
import { handleChatCompletion, ChatCompletionRequest } from './services/orchestration.service';
import { checkRateLimit, RATE_LIMIT_TIERS } from '../../../shared/lib/rate-limiter';
import { listActiveModels, getPricingCatalog } from '../../billing/src/services/pricing.service';
import { getWallet, getWalletTransactions } from '../../ledger/src/services/wallet.service';
import { createStripePaymentIntent, getUserPayments } from '../../../shared/lib/payments';
import { checkFraud } from '../../../shared/lib/fraud';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// CORS
app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

// =====================================================
// Middleware: Locale Detection
// =====================================================

app.addHook('preHandler', async (request, reply) => {
  const acceptLang = request.headers['accept-language'] || '';
  let locale = 'en';

  if (acceptLang.includes('zh')) locale = 'zh';
  else if (acceptLang.includes('ja')) locale = 'ja';
  else if (acceptLang.includes('ko')) locale = 'ko';
  else if (acceptLang.includes('ru')) locale = 'ru';

  // Allow override via query param or header
  const queryLang = (request.query as any)?.lang;
  const headerLang = request.headers['x-locale'];
  (request as any).locale = queryLang || headerLang || locale;
});

// =====================================================
// Middleware: API Key Authentication
// =====================================================

app.addHook('preHandler', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) return;

  const bearer = authHeader.replace('Bearer ', '');
  if (!bearer.startsWith('tsk_live_')) return;

  const keyHash = hashApiKey(bearer);

  const apiKey = await queryOne(
    `SELECT ak.*, u.user_type, u.status as user_status
     FROM api_keys ak
     JOIN users u ON ak.user_id = u.id
     WHERE ak.key_hash = $1 AND ak.revoked_at IS NULL`,
    [keyHash]
  );

  if (!apiKey) {
    reply.code(401).send({
      error: {
        message: 'Invalid API key',
        type: 'authentication_error',
        code: 'invalid_api_key',
      },
    });
    return;
  }

  if (apiKey.user_status !== 'active') {
    reply.code(403).send({
      error: {
        message: 'Account is suspended',
        type: 'authentication_error',
        code: 'account_suspended',
      },
    });
    return;
  }

  // Attach user context to request
  (request as any).userId = apiKey.user_id;
  (request as any).apiKeyId = apiKey.id;
  (request as any).apiKeyTier = apiKey.rate_limit_tier;
});

// =====================================================
// Unified API: POST /v1/chat/completions
// =====================================================

app.post<{ Body: ChatCompletionRequest }>('/v1/chat/completions', async (request, reply) => {
  const { userId, apiKeyId, apiKeyTier } = request as any;
  const { model, messages, temperature, max_tokens, stream, ...rest } = request.body;

  if (!model) {
    return reply.code(400).send({
      error: { message: 'model is required', type: 'invalid_request_error' },
    });
  }

  if (!messages || !Array.isArray(messages)) {
    return reply.code(400).send({
      error: { message: 'messages is required and must be an array', type: 'invalid_request_error' },
    });
  }

  try {
    const result = await handleChatCompletion(
      { model, messages, temperature, max_tokens, stream, ...rest } as ChatCompletionRequest,
      userId,
      apiKeyId,
      apiKeyTier,
      request.ip,
      request.headers['user-agent'] || ''
    );

    // Add rate limit headers
    reply.header('X-RateLimit-Limit', RATE_LIMIT_TIERS[apiKeyTier as keyof typeof RATE_LIMIT_TIERS]?.rpm || 60);
    reply.header('X-RateLimit-Remaining', '...');

    return result;
  } catch (error: any) {
    if (error.message.includes('Rate limit')) {
      return reply.code(429).send({
        error: { message: error.message, type: 'rate_limit_error' },
      });
    }

    if (error.message.includes('Insufficient')) {
      return reply.code(402).send({
        error: { message: error.message, type: 'insufficient_quota' },
      });
    }

    if (error.message.includes('blocked') || error.message.includes('security')) {
      return reply.code(403).send({
        error: { message: error.message, type: 'security_error' },
      });
    }

    return reply.code(502).send({
      error: { message: error.message || 'Provider error', type: 'provider_error' },
    });
  }
});

// =====================================================
// GET /v1/models — List available models
// =====================================================

app.get('/v1/models', async () => {
  const models = await listActiveModels();
  return {
    object: 'list',
    data: models.map((m: any) => ({
      id: m.slug,
      object: 'model',
      created: Math.floor(new Date(m.created_at).getTime() / 1000),
      owned_by: 'tokenspark',
    })),
  };
});

// =====================================================
// GET /v1/usage — Usage summary
// =====================================================

app.get('/v1/usage', async (request) => {
  const { userId } = request as any;
  const wallet = await getWallet(userId);

  return {
    balance: wallet?.balance || 0,
    reserved: wallet?.reservedBalance || 0,
    available: wallet ? wallet.balance - wallet.reservedBalance : 0,
    currency: 'USD',
  };
});

// =====================================================
// Wallet & Billing APIs
// =====================================================

app.get('/wallet/balance', async (request) => {
  const { userId } = request as any;
  const wallet = await getWallet(userId);
  return {
    balance: wallet?.balance || 0,
    reserved_balance: wallet?.reservedBalance || 0,
    available_balance: wallet ? wallet.balance - wallet.reservedBalance : 0,
    currency: wallet?.currency || 'USD',
  };
});

app.post('/wallet/topup', async (request, reply) => {
  const { userId } = request as any;
  const { amount, provider = 'stripe' } = request.body as any;

  if (!amount || amount < 1) {
    return reply.code(400).send({ error: { message: 'amount must be at least $0.01' } });
  }

  if (provider === 'stripe') {
    return await createStripePaymentIntent(userId, amount);
  }

  return reply.code(400).send({ error: { message: 'Unsupported payment provider' } });
});

app.get('/wallet/transactions', async (request) => {
  const { userId } = request as any;
  const txns = await getWalletTransactions(userId);
  return { data: txns };
});

app.get('/billing/models', async () => {
  return { data: await getPricingCatalog() };
});

// =====================================================
// API Keys Management
// =====================================================

app.get('/api-keys', async (request) => {
  const { userId } = request as any;
  const keys = await queryOne(
    `SELECT id, key_prefix, name, permissions, rate_limit_tier, last_used_at, created_at
     FROM api_keys WHERE user_id = $1 AND revoked_at IS NULL ORDER BY created_at DESC`,
    [userId]
  );
  return { data: keys };
});

// =====================================================
// Health Check
// =====================================================

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// =====================================================
// Webhooks
// =====================================================

app.post('/webhooks/stripe', async (request, reply) => {
  const sig = request.headers['stripe-signature'];
  const body = request.body as any;

  // Verify webhook signature in production
  // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  // await handleStripeWebhook(event);

  return { received: true };
});

// =====================================================
// Error Handler
// =====================================================

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  return reply.code(error.statusCode || 500).send({
    error: {
      message: error.message || 'Internal server error',
      type: 'internal_error',
    },
  });
});

// =====================================================
// Start Server
// =====================================================

const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`TokenSpark API server running on http://${HOST}:${PORT}`);
    console.log(`Health check: http://${HOST}:${PORT}/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
