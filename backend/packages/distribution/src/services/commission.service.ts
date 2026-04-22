/**
 * Commission Service — Three-Tier Commission Engine
 *
 * Calculates and distributes commissions for:
 * - Tier 1: Direct referrer (Agent) — 10%
 * - Tier 2: Upline referrer (Partner) — 5%
 * - Tier 3: Top-level referrer (Enterprise) — 2%
 */

import { query, queryOne, transaction } from '../../../shared/lib/database';
import { Commission } from '@tokenspark/domain';
import { percentageOf } from '../../../shared/lib/money';

// Commission rates by tier level
const TIER_RATES = {
  1: 0.10, // 10% for direct referrer
  2: 0.05, // 5% for upline
  3: 0.02, // 2% for top-level
};

/**
 * Calculate commissions for a billing transaction
 * Traverses up the partner chain up to 3 levels
 */
export async function calculateCommissions(
  sourceUserId: string,
  sourceTransactionId: string,
  sourceAmount: number
): Promise<Commission[]> {
  const commissions: Commission[] = [];

  // Get the partner chain for this user
  const chain = await getPartnerChain(sourceUserId);

  for (let i = 0; i < Math.min(chain.length, 3); i++) {
    const partner = chain[i];
    const tierLevel = i + 1;
    const rate = partner.overrideRate ?? TIER_RATES[tierLevel as keyof typeof TIER_RATES];
    const commissionAmount = percentageOf(sourceAmount, rate);

    if (commissionAmount <= 0) continue;

    const commission = await createCommission({
      partnerId: partner.id,
      sourceTransactionId,
      sourceUserId,
      tierLevel,
      sourceAmount,
      commissionRate: rate,
      commissionAmount,
      currency: 'USD',
      status: 'pending',
      availableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day hold
    });

    commissions.push(commission);

    // Update partner pending earnings
    await query(
      `UPDATE partners SET pending_earnings = pending_earnings + $1 WHERE id = $2`,
      [commissionAmount, partner.id]
    );
  }

  return commissions;
}

/**
 * Get the partner chain (upline) for a user
 */
async function getPartnerChain(userId: string): Promise<any[]> {
  const chain: any[] = [];

  // Find the user's direct referrer partner
  let currentPartner = await queryOne(
    `SELECT p.* FROM partners p
     JOIN referrals r ON p.id = r.partner_id
     WHERE r.referred_user_id = $1 AND r.status = 'converted'`,
    [userId]
  );

  while (currentPartner) {
    chain.push(currentPartner);

    if (chain.length >= 3) break; // Max 3 tiers

    // Move up the chain
    currentPartner = await queryOne(
      `SELECT * FROM partners WHERE id = $1 AND status = 'active'`,
      [currentPartner.parent_partner_id]
    );
  }

  return chain;
}

interface CreateCommissionInput {
  partnerId: string;
  sourceTransactionId: string;
  sourceUserId: string;
  tierLevel: number;
  sourceAmount: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: string;
  availableAt: Date;
}

async function createCommission(input: CreateCommissionInput): Promise<Commission> {
  const result = await queryOne<Commission>(
    `INSERT INTO commissions (
      partner_id, source_transaction_id, source_user_id,
      tier_level, source_amount, commission_rate, commission_amount,
      currency, status, available_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      input.partnerId,
      input.sourceTransactionId,
      input.sourceUserId,
      input.tierLevel,
      input.sourceAmount,
      input.commissionRate,
      input.commissionAmount,
      input.currency,
      input.status,
      input.availableAt,
    ]
  );

  return result!;
}

/**
 * Make commissions available (after hold period)
 */
export async function releasePendingCommissions(): Promise<number> {
  const result = await query(
    `UPDATE commissions
     SET status = 'available'
     WHERE status = 'pending' AND available_at <= NOW()
     RETURNING id, partner_id, commission_amount`
  );

  return result.length;
}

/**
 * Get partner commission summary
 */
export async function getPartnerCommissionSummary(
  partnerId: string
): Promise<{
  totalEarned: number;
  totalPaid: number;
  pendingAmount: number;
  availableAmount: number;
}> {
  const result = await queryOne(
    `SELECT
       COALESCE(SUM(commission_amount), 0) as total_earned,
       COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0) as total_paid,
       COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0) as pending_amount,
       COALESCE(SUM(CASE WHEN status = 'available' THEN commission_amount ELSE 0 END), 0) as available_amount
     FROM commissions
     WHERE partner_id = $1`,
    [partnerId]
  );

  return {
    totalEarned: parseInt(result?.total_earned || '0'),
    totalPaid: parseInt(result?.total_paid || '0'),
    pendingAmount: parseInt(result?.pending_amount || '0'),
    availableAmount: parseInt(result?.available_amount || '0'),
  };
}

/**
 * Get commissions for a partner
 */
export async function getPartnerCommissions(
  partnerId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Commission[]> {
  return query(
    `SELECT * FROM commissions
     WHERE partner_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [partnerId, limit, offset]
  );
}
