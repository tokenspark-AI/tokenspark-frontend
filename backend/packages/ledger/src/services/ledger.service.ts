/**
 * Ledger Service — Double-Entry Bookkeeping Engine
 *
 * THE SOURCE OF TRUTH for all financial operations.
 * Every transaction creates balanced debit/credit entries.
 * Invariant: SUM(debits) = SUM(credits) for every transaction.
 */

import { PoolClient } from 'pg';
import { query, queryOne, transaction } from '../../../shared/lib/database';
import {
  LedgerTransaction,
  LedgerEntry,
  LedgerTransactionType,
  AccountType,
} from '@tokenspark/domain';
import { LedgerInvariantError } from '../../../shared/lib/errors';

export interface CreateTransactionInput {
  idempotencyKey: string;
  userId: string;
  totalAmount: number;
  currency: string;
  type: LedgerTransactionType;
  description?: string;
  metadata?: Record<string, any>;
  entries: Omit<LedgerEntryInput, 'transactionId'>[];
}

export interface LedgerEntryInput {
  entryType: 'debit' | 'credit';
  accountType: AccountType;
  accountId: string;
  amount: number;
  currency: string;
  referenceType: string;
  referenceId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a ledger transaction with double-entry bookkeeping.
 * ATOMIC: all entries are created in a single DB transaction.
 * IDEMPOTENT: same idempotencyKey returns existing transaction.
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<LedgerTransaction> {
  return transaction(async (client) => {
    // Check idempotency
    const existing = await queryOne<LedgerTransaction>(
      `SELECT * FROM ledger_transactions WHERE idempotency_key = $1`,
      [input.idempotencyKey]
    );

    if (existing) {
      return existing;
    }

    // Validate ledger invariant: debits must equal credits
    validateLedgerInvariant(input.entries);

    // Create transaction record
    const txnResult = await client.query<LedgerTransaction>(
      `INSERT INTO ledger_transactions (
        idempotency_key, user_id, total_amount, currency, type,
        description, metadata, status, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', NOW())
      RETURNING *`,
      [
        input.idempotencyKey,
        input.userId,
        input.totalAmount,
        input.currency,
        input.type,
        input.description || null,
        JSON.stringify(input.metadata || {}),
      ]
    );

    const txn = txnResult.rows[0];

    // Create all ledger entries
    const entryPromises = input.entries.map((entry) =>
      client.query(
        `INSERT INTO ledger_entries (
          transaction_id, entry_type, account_type, account_id,
          amount, currency, reference_type, reference_id,
          description, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          txn.id,
          entry.entryType,
          entry.accountType,
          entry.accountId,
          entry.amount,
          entry.currency,
          entry.referenceType,
          entry.referenceId || null,
          entry.description || null,
          JSON.stringify(entry.metadata || {}),
        ]
      )
    );

    await Promise.all(entryPromises);

    return txn;
  });
}

/**
 * Validate that debits equal credits for a set of entries.
 */
function validateLedgerInvariant(entries: Omit<LedgerEntryInput, 'transactionId'>[]): void {
  let totalDebits = 0;
  let totalCredits = 0;

  for (const entry of entries) {
    if (entry.entryType === 'debit') {
      totalDebits += entry.amount;
    } else {
      totalCredits += entry.amount;
    }
  }

  if (totalDebits !== totalCredits) {
    throw new LedgerInvariantError(
      `Debits (${totalDebits}) !== Credits (${totalCredits})`
    );
  }

  if (totalDebits === 0 && totalCredits === 0) {
    throw new LedgerInvariantError('Transaction amount cannot be zero');
  }
}

/**
 * Get transaction by ID
 */
export async function getTransaction(id: string): Promise<LedgerTransaction | null> {
  return queryOne(
    `SELECT * FROM ledger_transactions WHERE id = $1`,
    [id]
  );
}

/**
 * Get all entries for a transaction
 */
export async function getTransactionEntries(transactionId: string): Promise<LedgerEntry[]> {
  return query(
    `SELECT * FROM ledger_entries WHERE transaction_id = $1 ORDER BY id`,
    [transactionId]
  );
}

/**
 * Get ledger entries for a user with pagination
 */
export async function getUserEntries(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ entries: LedgerEntry[]; total: number }> {
  const entries = await query<LedgerEntry>(
    `SELECT * FROM ledger_entries
     WHERE account_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const totalResult = await queryOne<{ total: string }>(
    `SELECT COUNT(*) as total FROM ledger_entries WHERE account_id = $1`,
    [userId]
  );

  return {
    entries,
    total: parseInt(totalResult?.total || '0'),
  };
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<LedgerTransaction[]> {
  return query(
    `SELECT * FROM ledger_transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
}

/**
 * Ledger health check: verify all transactions balance
 */
export async function checkLedgerHealth(): Promise<{ healthy: boolean; issues: string[] }> {
  const issues: string[] = [];

  // Check for unbalanced transactions
  const unbalanced = await query(
    `SELECT transaction_id,
            SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END) as total_debits,
            SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END) as total_credits
     FROM ledger_entries
     GROUP BY transaction_id
     HAVING SUM(CASE WHEN entry_type = 'debit' THEN amount ELSE 0 END) !=
            SUM(CASE WHEN entry_type = 'credit' THEN amount ELSE 0 END)`
  );

  if (unbalanced.length > 0) {
    issues.push(`${unbalanced.length} unbalanced transactions found`);
  }

  // Check for orphaned entries
  const orphaned = await query(
    `SELECT COUNT(*) as count
     FROM ledger_entries le
     LEFT JOIN ledger_transactions lt ON le.transaction_id = lt.id
     WHERE lt.id IS NULL`
  );

  if (parseInt(orphaned[0]?.count || '0') > 0) {
    issues.push('Orphaned ledger entries found');
  }

  return {
    healthy: issues.length === 0,
    issues,
  };
}

/**
 * Reverse a transaction (for refunds)
 */
export async function reverseTransaction(
  transactionId: string,
  reason: string
): Promise<LedgerTransaction> {
  const original = await getTransaction(transactionId);
  if (!original) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  if (original.status === 'reversed') {
    throw new Error(`Transaction ${transactionId} already reversed`);
  }

  const entries = await getTransactionEntries(transactionId);

  // Create reverse entries (swap debit/credit)
  const reverseEntries = entries.map((entry) => ({
    entryType: entry.entryType === 'debit' ? 'credit' as const : 'debit' as const,
    accountType: entry.accountType,
    accountId: entry.accountId,
    amount: entry.amount,
    currency: entry.currency,
    referenceType: 'reversal',
    referenceId: transactionId,
    description: `Reversal: ${reason}`,
  }));

  // Update original status
  await query(
    `UPDATE ledger_transactions SET status = 'reversed' WHERE id = $1`,
    [transactionId]
  );

  return createTransaction({
    idempotencyKey: `reversal_${transactionId}`,
    userId: original.userId,
    totalAmount: original.totalAmount,
    currency: original.currency,
    type: 'refund',
    description: `Reversal of ${transactionId}: ${reason}`,
    metadata: { originalTransactionId: transactionId, reason },
    entries: reverseEntries,
  });
}
