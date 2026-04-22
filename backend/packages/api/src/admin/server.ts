/**
 * TokenSpark Admin API Server
 *
 * Management APIs for system administrators.
 * Covers: user management, ledger audit, provider config,
 * fraud review, pricing updates, settlement execution.
 */

import Fastify from 'fastify';
import { query, queryOne } from '../../shared/lib/database';
import { checkLedgerHealth, getTransaction, getTransactionEntries } from '../../ledger/src/services/ledger.service';

const app = Fastify({ logger: true });

// =====================================================
// User Management
// =====================================================

app.get('/admin/users', async (request) => {
  const { limit = 50, offset = 0, status, userType } = request.query as any;

  let sql = `SELECT id, email, name, user_type, status, kyc_status,
                    referral_code, created_at
             FROM users WHERE 1=1`;
  const params: any[] = [];

  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }
  if (userType) {
    params.push(userType);
    sql += ` AND user_type = $${params.length}`;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const users = await query(sql, params);
  return { data: users };
});

app.get('/admin/users/:id', async (request) => {
  const { id } = request.params as { id: string };
  const user = await queryOne(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return user || { error: 'User not found' };
});

app.patch('/admin/users/:id/status', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { status } = request.body as { status: string };

  const user = await queryOne(
    `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );

  if (!user) {
    return reply.code(404).send({ error: 'User not found' });
  }

  return user;
});

// =====================================================
// Ledger Audit
// =====================================================

app.get('/admin/ledger/health', async () => {
  return await checkLedgerHealth();
});

app.get('/admin/ledger/transactions', async (request) => {
  const { limit = 50, offset = 0, type } = request.query as any;

  let sql = `SELECT * FROM ledger_transactions WHERE 1=1`;
  const params: any[] = [];

  if (type) {
    params.push(type);
    sql += ` AND type = $${params.length}`;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const txns = await query(sql, params);
  return { data: txns };
});

app.get('/admin/ledger/transactions/:id', async (request) => {
  const { id } = request.params as { id: string };
  const txn = await getTransaction(id);
  if (!txn) return { error: 'Transaction not found' };

  const entries = await getTransactionEntries(id);
  return { transaction: txn, entries };
});

// =====================================================
// Provider Management
// =====================================================

app.get('/admin/providers', async () => {
  const providers = await query(
    `SELECT id, slug, display_name, base_url, health_status,
            avg_latency_ms, success_rate, priority, created_at
     FROM providers ORDER BY priority`
  );
  return { data: providers };
});

app.patch('/admin/providers/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { healthStatus, priority } = request.body as any;

  const provider = await queryOne(
    `UPDATE providers SET
       health_status = COALESCE($1, health_status),
       priority = COALESCE($2, priority),
       updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [healthStatus, priority, id]
  );

  if (!provider) {
    return reply.code(404).send({ error: 'Provider not found' });
  }

  return provider;
});

// =====================================================
// Fraud Review
// =====================================================

app.get('/admin/fraud/events', async (request) => {
  const { limit = 50, offset = 0, reviewed } = request.query as any;

  let sql = `SELECT * FROM fraud_events WHERE 1=1`;
  const params: any[] = [];

  if (reviewed !== undefined) {
    params.push(reviewed === 'true');
    sql += ` AND reviewed = $${params.length}`;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(parseInt(limit), parseInt(offset));

  const events = await query(sql, params);
  return { data: events };
});

app.patch('/admin/fraud/events/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { actionTaken, reviewedBy } = request.body as any;

  const event = await queryOne(
    `UPDATE fraud_events SET
       action_taken = $1, reviewed = true,
       reviewed_by = $2, reviewed_at = NOW()
     WHERE id = $3 RETURNING *`,
    [actionTaken, reviewedBy, id]
  );

  if (!event) {
    return reply.code(404).send({ error: 'Event not found' });
  }

  return event;
});

// =====================================================
// Pricing Management
// =====================================================

app.get('/admin/pricing', async () => {
  const models = await query(
    `SELECT m.id, m.slug, m.display_name, m.input_price_per_million,
            m.output_price_per_million, m.context_window,
            m.is_active, p.slug as provider_slug
     FROM models m JOIN providers p ON m.provider_id = p.id
     ORDER BY m.slug`
  );
  return { data: models };
});

app.patch('/admin/pricing/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { inputPricePerMillion, outputPricePerMillion, isActive } = request.body as any;

  const model = await queryOne(
    `UPDATE models SET
       input_price_per_million = COALESCE($1, input_price_per_million),
       output_price_per_million = COALESCE($2, output_price_per_million),
       is_active = COALESCE($3, is_active),
       updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [inputPricePerMillion, outputPricePerMillion, isActive, id]
  );

  if (!model) {
    return reply.code(404).send({ error: 'Model not found' });
  }

  return model;
});

// =====================================================
// Analytics
// =====================================================

app.get('/admin/analytics/overview', async () => {
  const stats = await queryOne(
    `SELECT
       (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
       (SELECT COUNT(*) FROM api_requests WHERE status = 'completed') as total_requests,
       (SELECT COALESCE(SUM(total_cost), 0) FROM billing_transactions WHERE status = 'charged') as total_revenue,
       (SELECT COALESCE(SUM(total_tokens), 0) FROM billing_transactions WHERE status = 'charged') as total_tokens,
       (SELECT COUNT(*) FROM fraud_events WHERE reviewed = false) as pending_fraud_events`
  );

  return stats;
});

// =====================================================
// System Health
// =====================================================

app.get('/admin/health', async () => {
  const ledgerHealth = await checkLedgerHealth();

  const providerHealth = await query(
    `SELECT slug, health_status, avg_latency_ms, success_rate
     FROM providers ORDER BY slug`
  );

  return {
    ledger: ledgerHealth,
    providers: providerHealth,
    timestamp: new Date().toISOString(),
  };
});

// =====================================================
// Start
// =====================================================

const PORT = parseInt(process.env.ADMIN_PORT || '3004');

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`TokenSpark Admin API running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
