/**
 * TokenSpark Ledger Service Server
 *
 * Exposes ledger and wallet management APIs.
 */

import Fastify from 'fastify';
import { createTransaction, reverseTransaction, getUserEntries, getUserTransactions, checkLedgerHealth } from './services/ledger.service';
import { getOrCreateWallet, getWallet, getWalletTransactions, creditFunds, reserveFunds, releaseFunds } from './services/wallet.service';

const app = Fastify({ logger: true });

// =====================================================
// Ledger API
// =====================================================

app.post('/ledger/transactions', async (request, reply) => {
  const body = request.body as any;
  const txn = await createTransaction(body);
  return txn;
});

app.get('/ledger/transactions/:id', async (request) => {
  const { entries } = await getUserEntries(
    (request.params as any).id,
    100,
    0
  );
  return { data: entries };
});

app.get('/ledger/health', async () => {
  return await checkLedgerHealth();
});

app.post('/ledger/transactions/:id/reverse', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { reason } = request.body as { reason: string };
  const txn = await reverseTransaction(id, reason);
  return txn;
});

// =====================================================
// Wallet API
// =====================================================

app.get('/wallet/:userId', async (request) => {
  const { userId } = request.params as { userId: string };
  const wallet = await getWallet(userId);
  return wallet || { error: 'Wallet not found' };
});

app.post('/wallet/:userId/credit', async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const { amount, currency } = request.body as { amount: number; currency?: string };

  if (!amount || amount <= 0) {
    return reply.code(400).send({ error: 'amount must be positive' });
  }

  const wallet = await creditFunds(userId, amount, currency);
  return wallet;
});

app.get('/wallet/:userId/transactions', async (request) => {
  const { userId } = request.params as { userId: string };
  const txns = await getWalletTransactions(userId);
  return { data: txns };
});

// =====================================================
// Admin APIs
// =====================================================

app.get('/admin/ledger/health', async () => {
  return await checkLedgerHealth();
});

app.get('/admin/users/:userId/ledger', async (request) => {
  const { userId } = request.params as { userId: string };
  const { entries, total } = await getUserEntries(userId);
  return { data: entries, total };
});

const PORT = parseInt(process.env.LEDGER_PORT || '3002');

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`TokenSpark Ledger service running on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
