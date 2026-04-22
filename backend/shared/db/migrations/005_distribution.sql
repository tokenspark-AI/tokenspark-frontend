-- =====================================================
-- TokenSpark Database Migration 005: Distribution Network
-- Three-Tier: Agent → Partner → Enterprise
-- =====================================================

-- Partner registry (extends users table)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  parent_partner_id UUID REFERENCES partners(id),
  tier VARCHAR(20) NOT NULL DEFAULT 'agent'
    CHECK (tier IN ('agent', 'partner', 'enterprise')),
  commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.10,
  override_rate NUMERIC(5,4),
  payout_threshold BIGINT DEFAULT 10000,
  payout_method VARCHAR(20) DEFAULT 'stripe'
    CHECK (payout_method IN ('stripe', 'alipay', 'wechat_pay', 'usdt', 'bank')),
  payout_address JSONB,
  total_earnings BIGINT DEFAULT 0,
  total_paid BIGINT DEFAULT 0,
  pending_earnings BIGINT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'terminated')),
  white_label_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_partners_user ON partners(user_id);
CREATE INDEX idx_partners_parent ON partners(parent_partner_id);
CREATE INDEX idx_partners_tier ON partners(tier);

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Referral tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES users(id),
  referral_code VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'converted', 'expired')),
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_partner ON referrals(partner_id);
CREATE INDEX idx_referrals_user ON referrals(referred_user_id);

-- Commission records
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  source_transaction_id UUID REFERENCES billing_transactions(id),
  source_user_id UUID NOT NULL REFERENCES users(id),
  tier_level INTEGER NOT NULL CHECK (tier_level BETWEEN 1 AND 3),
  source_amount BIGINT NOT NULL,
  commission_rate NUMERIC(5,4) NOT NULL,
  commission_amount BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'available', 'paid', 'reversed')),
  available_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_partner ON commissions(partner_id, status);
CREATE INDEX idx_commissions_available ON commissions(status, available_at)
  WHERE status = 'pending';
CREATE INDEX idx_commissions_source ON commissions(source_transaction_id);

-- Payout records
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  amount BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  provider VARCHAR(20) NOT NULL
    CHECK (provider IN ('stripe', 'alipay', 'wechat_pay', 'usdt', 'bank')),
  provider_payout_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),
  commission_ids UUID[],
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_payouts_partner ON payouts(partner_id, status);
