/**
 * Wallet Service
 *
 * Manages user wallet balances with optimistic locking.
 * Supports: balance check, reserve funds, charge, release, top-up.
 */

import { PoolClient } from 'pg';
import { query, queryOne, transaction } from '../../../shared/lib/database';
import { Wallet } from '@tokenspark/domain';
import { InsufficientFundsError, NotFoundError } from '../../../shared/lib/errors';

/**
 * Get or create wallet for user
 */
export async function getOrCreateWallet(
  userId: string,
  currency: string = 'USD'
): Promise<Wallet> {
  const wallet = await queryOne<Wallet>(
    `SELECT * FROM wallets WHERE user_id = $1 AND currency = $2`,
    [userId, currency]
  );

  if (wallet) return wallet;

  return transaction(async (client) => {
    const result = await client.query(
      `INSERT INTO wallets (user_id, currency, balance, reserved_balance, version)
       VALUES ($1, $2, 0, 0, 0)
       ON CONFLICT (user_id, currency) DO NOTHING
       RETURNING *`,
      [userId, currency]
    );

    if (result.rows.length === 0) {
      // Race condition — another thread created it
      return (await queryOne<Wallet>(
        `SELECT * FROM wallets WHERE user_id = $1 AND currency = $2`,
        [userId, currency]
      ))!;
    }

    return result.rows[0];
  });
}

/**
 * Get wallet balance
 */
export async function getWallet(userId: string, currency: string = 'USD'): Promise<Wallet | null> {
  return queryOne(
    `SELECT * FROM wallets WHERE user_id = $1 AND currency = $2`,
    [userId, currency]
  );
}

/**
 * Get available balance (balance - reserved)
 */
export async function getAvailableBalance(
  userId: string,
  currency: string = 'USD'
): Promise<number> {
  const wallet = await getWallet(userId, currency);
  if (!wallet) return 0;
  return wallet.balance - wallet.reservedBalance;
}

/**
 * Reserve (freeze) funds for pending transaction
 * Returns the updated wallet
 */
export async function reserveFunds(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<Wallet> {
  return transaction(async (client) => {
    const result = await client.query(
      `UPDATE wallets
       SET reserved_balance = reserved_balance + $1,
           version = version + 1,
           updated_at = NOW()
       WHERE user_id = $2 AND currency = $3
         AND (balance - reserved_balance) >= $1
       RETURNING *`,
      [amount, userId, currency]
    );

    if (result.rows.length === 0) {
      const wallet = await getWallet(userId, currency);
      const available = wallet ? wallet.balance - wallet.reservedBalance : 0;
      throw new InsufficientFundsError(available, amount);
    }

    return result.rows[0];
  });
}

/**
 * Charge funds: deduct from balance and release reservation
 */
export async function chargeFunds(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<Wallet> {
  return transaction(async (client) => {
    const result = await client.query(
      `UPDATE wallets
       SET balance = balance - $1,
           reserved_balance = reserved_balance - $1,
           version = version + 1,
           updated_at = NOW()
       WHERE user_id = $2 AND currency = $3
         AND reserved_balance >= $1
       RETURNING *`,
      [amount, userId, currency]
    );

    if (result.rows.length === 0) {
      const wallet = await getWallet(userId, currency);
      throw new Error(
        `Cannot charge: wallet=${wallet?.id}, reserved=${wallet?.reservedBalance}, amount=${amount}`
      );
    }

    return result.rows[0];
  });
}

/**
 * Release reserved funds back to available balance
 */
export async function releaseFunds(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<Wallet> {
  return transaction(async (client) => {
    const result = await client.query(
      `UPDATE wallets
       SET reserved_balance = reserved_balance - $1,
           version = version + 1,
           updated_at = NOW()
       WHERE user_id = $2 AND currency = $3
         AND reserved_balance >= $1
       RETURNING *`,
      [amount, userId, currency]
    );

    if (result.rows.length === 0) {
      const wallet = await getWallet(userId, currency);
      throw new Error(
        `Cannot release: wallet=${wallet?.id}, reserved=${wallet?.reservedBalance}, amount=${amount}`
      );
    }

    return result.rows[0];
  });
}

/**
 * Credit funds (for top-ups, refunds, etc.)
 */
export async function creditFunds(
  userId: string,
  amount: number,
  currency: string = 'USD'
): Promise<Wallet> {
  return transaction(async (client) => {
    // Ensure wallet exists
    await getOrCreateWallet(userId, currency);

    const result = await client.query(
      `UPDATE wallets
       SET balance = balance + $1,
           version = version + 1,
           updated_at = NOW()
       WHERE user_id = $2 AND currency = $3
       RETURNING *`,
      [amount, userId, currency]
    );

    return result.rows[0];
  });
}

/**
 * Get user's wallet transaction history
 */
export async function getWalletTransactions(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  return query(
    `SELECT lt.*, le.account_type, le.entry_type, le.amount
     FROM ledger_transactions lt
     JOIN ledger_entries le ON lt.id = le.transaction_id
     WHERE lt.user_id = $1 AND le.account_type = 'user_wallet'
     ORDER BY lt.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
}
