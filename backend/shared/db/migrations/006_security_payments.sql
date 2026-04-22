-- =====================================================
-- TokenSpark Database Migration 006: Security & Fraud
-- =====================================================

-- Rate limit tracking (persistent, also cached in Redis)
CREATE TABLE IF NOT EXISTS rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  api_key_id UUID REFERENCES api_keys(id),
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL,
  window_end TIMESTAMPTZ NOT NULL,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_user ON rate_limit_logs(user_id, window_start DESC);

-- Fraud detection events
CREATE TABLE IF NOT EXISTS fraud_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  api_key_id UUID REFERENCES api_keys(id),
  event_type VARCHAR(50) NOT NULL
    CHECK (event_type IN (
      'self_payment', 'circular_call', 'refund_abuse',
      'rate_limit_exceeded', 'token_anomaly', 'ip_velocity',
      'model_hopping', 'pattern_match', 'balance_manipulation'
    )),
  severity VARCHAR(20) NOT NULL DEFAULT 'low'
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  risk_score INTEGER DEFAULT 0,
  description TEXT,
  evidence JSONB,
  action_taken VARCHAR(30)
    CHECK (action_taken IN ('none', 'warning', 'throttle', 'block', 'suspend')),
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fraud_user ON fraud_events(user_id, created_at DESC);
CREATE INDEX idx_fraud_type ON fraud_events(event_type);
CREATE INDEX idx_fraud_unreviewed ON fraud_events(reviewed) WHERE reviewed = false;

-- Audit log (all admin actions)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_admin ON audit_log(admin_user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_log(resource_type, resource_id);

-- =====================================================
-- Payment Integration
-- =====================================================

-- External payment records
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  provider VARCHAR(20) NOT NULL
    CHECK (provider IN ('stripe', 'alipay', 'wechat_pay', 'usdt')),
  provider_payment_id VARCHAR(255) UNIQUE,
  amount BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_payment_user ON payment_intents(user_id, created_at DESC);
CREATE INDEX idx_payment_provider_id ON payment_intents(provider_payment_id);

-- Payouts for partners
CREATE TABLE IF NOT EXISTS partner_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  amount BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  provider VARCHAR(20) NOT NULL,
  provider_payout_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),
  commission_ids UUID[],
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_partner_payouts_partner ON partner_payouts(partner_id, status);
