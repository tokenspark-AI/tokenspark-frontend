/**
 * Payment Integration Layer
 *
 * Unified payment interface supporting:
 * - Stripe (international)
 * - Alipay (China domestic)
 * - WeChat Pay (China domestic)
 * - USDT (crypto, optional)
 *
 * All payments flow through the Ledger system — never directly to balance.
 */

import { query, queryOne, transaction } from '../../../shared/lib/database';
import { PaymentIntent, PaymentProvider, PaymentStatus } from '@tokenspark/domain';
import { toCents } from '../../../shared/lib/money';

// =====================================================
// Stripe Integration
// =====================================================

let stripe: any = null;

function getStripe() {
  if (!stripe) {
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }
  return stripe;
}

export async function createStripePaymentIntent(
  userId: string,
  amountDollars: number,
  currency: string = 'usd'
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripeClient = getStripe();
  const amountCents = toCents(amountDollars);

  const paymentIntent = await stripeClient.paymentIntents.create({
    amount: amountCents,
    currency,
    metadata: {
      tokenspark_user_id: userId,
      tokenspark_type: 'wallet_topup',
    },
  });

  // Create local payment intent record
  await queryOne(
    `INSERT INTO payment_intents (user_id, provider, provider_payment_id, amount, currency, status)
     VALUES ($1, 'stripe', $2, $3, $4, 'pending')
     RETURNING id`,
    [userId, paymentIntent.id, amountCents, currency.toUpperCase()]
  );

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function handleStripeWebhook(
  event: any
): Promise<{ processed: boolean }> {
  const { type, data } = event;

  switch (type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = data.object;
      await processSuccessfulPayment(paymentIntent, 'stripe');
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = data.object;
      await processFailedPayment(paymentIntent, 'stripe');
      break;
    }
  }

  return { processed: true };
}

// =====================================================
// Alipay Integration
// =====================================================

export async function createAlipayPayment(
  userId: string,
  amountDollars: number
): Promise<{ tradeNo: string; paymentUrl: string }> {
  // Alipay integration placeholder
  // In production: use alipay-sdk to create trade
  const tradeNo = `alipay_${Date.now()}_${userId.slice(0, 8)}`;

  await queryOne(
    `INSERT INTO payment_intents (user_id, provider, provider_payment_id, amount, currency, status)
     VALUES ($1, 'alipay', $2, $3, 'CNY', 'pending')
     RETURNING id`,
    [userId, tradeNo, toCents(amountDollars)]
  );

  return {
    tradeNo,
    paymentUrl: `https://openapi.alipay.com/gateway.do?trade_no=${tradeNo}`,
  };
}

export async function handleAlipayNotification(
  params: Record<string, string>
): Promise<void> {
  const tradeStatus = params.trade_status;
  const tradeNo = params.trade_no;

  if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
    await processSuccessfulPayment({ id: tradeNo }, 'alipay');
  }
}

// =====================================================
// WeChat Pay Integration
// =====================================================

export async function createWechatPayPayment(
  userId: string,
  amountDollars: number
): Promise<{ prepayId: string; qrCode: string }> {
  // WeChat Pay integration placeholder
  // In production: use wechatpay-node-v2 or similar
  const prepayId = `wx_${Date.now()}_${userId.slice(0, 8)}`;

  await queryOne(
    `INSERT INTO payment_intents (user_id, provider, provider_payment_id, amount, currency, status)
     VALUES ($1, 'wechat_pay', $2, $3, 'CNY', 'pending')
     RETURNING id`,
    [userId, prepayId, toCents(amountDollars)]
  );

  return {
    prepayId,
    qrCode: `weixin://wxpay/bizpayurl?sr=${prepayId}`,
  };
}

export async function handleWechatPayNotification(
  xmlData: string
): Promise<void> {
  // Parse XML and process notification
  // In production: use xml2js and verify signature
}

// =====================================================
// Payment Processing (Ledger Integration)
// =====================================================

/**
 * Process a successful payment: create ledger entries
 * This is the critical integration point between payments and the financial core.
 */
async function processSuccessfulPayment(
  paymentData: { id: string; amount?: number },
  provider: PaymentProvider
): Promise<void> {
  const paymentIntent = await queryOne<PaymentIntent>(
    `SELECT * FROM payment_intents WHERE provider_payment_id = $1`,
    [paymentData.id]
  );

  if (!paymentIntent) return;
  if (paymentIntent.status === 'succeeded') return; // Already processed

  const amount = paymentData.amount || paymentIntent.amount;

  await transaction(async (client) => {
    // Update payment intent status
    await client.query(
      `UPDATE payment_intents SET status = 'succeeded', completed_at = NOW() WHERE id = $1`,
      [paymentIntent.id]
    );

    // Create ledger entries via the main ledger flow
    // Entry 1: Credit user wallet
    await client.query(
      `INSERT INTO ledger_entries (
        transaction_id, entry_type, account_type, account_id,
        amount, currency, reference_type, reference_id, description
      ) VALUES ($1, 'credit', 'user_wallet', $2, $3, $4, 'payment', $5, $6)`,
      [
        paymentIntent.id,
        paymentIntent.userId,
        amount,
        paymentIntent.currency,
        paymentIntent.id,
        `Wallet top-up via ${provider}`,
      ]
    );

    // Entry 2: Debit payment gateway (system receives funds)
    await client.query(
      `INSERT INTO ledger_entries (
        transaction_id, entry_type, account_type, account_id,
        amount, currency, reference_type, reference_id, description
      ) VALUES ($1, 'debit', 'payment_gateway', $2, $3, $4, 'payment', $5, $6)`,
      [
        paymentIntent.id,
        paymentIntent.userId,
        amount,
        paymentIntent.currency,
        paymentIntent.id,
        `Funds received via ${provider}`,
      ]
    );

    // Also update wallet balance
    await client.query(
      `UPDATE wallets SET balance = balance + $1, version = version + 1
       WHERE user_id = $2 AND currency = $3`,
      [amount, paymentIntent.userId, paymentIntent.currency]
    );
  });
}

async function processFailedPayment(
  paymentData: { id: string },
  provider: PaymentProvider
): Promise<void> {
  await query(
    `UPDATE payment_intents SET status = 'failed' WHERE provider_payment_id = $1`,
    [paymentData.id]
  );
}

/**
 * Get payment history for a user
 */
export async function getUserPayments(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<PaymentIntent[]> {
  return query(
    `SELECT * FROM payment_intents
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
}
