-- =====================================================
-- TokenSpark Database Migration 004: Billing & API Requests
-- =====================================================

-- API request tracking
CREATE TABLE IF NOT EXISTS api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  api_key_id UUID REFERENCES api_keys(id),
  model_slug VARCHAR(100) NOT NULL,
  provider_slug VARCHAR(50),
  endpoint VARCHAR(255) NOT NULL DEFAULT '/v1/chat/completions',
  request_body_hash VARCHAR(64),
  response_status INTEGER,
  response_time_ms INTEGER,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  route_attempts INTEGER DEFAULT 1,
  fallback_used BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  fraud_flags JSONB DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed', 'failed', 'timeout', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_api_requests_user ON api_requests(user_id, created_at DESC);
CREATE INDEX idx_api_requests_status ON api_requests(status) WHERE status = 'processing';
CREATE INDEX idx_api_requests_model ON api_requests(model_slug);

-- Billing transactions (one per API call)
CREATE TABLE IF NOT EXISTS billing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  api_key_id UUID REFERENCES api_keys(id),
  model_id UUID NOT NULL REFERENCES models(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  request_id UUID NOT NULL REFERENCES api_requests(id),
  ledger_transaction_id UUID REFERENCES ledger_transactions(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'charged', 'refunded', 'failed')),
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  input_cost BIGINT NOT NULL DEFAULT 0,
  output_cost BIGINT NOT NULL DEFAULT 0,
  total_cost BIGINT NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_user_date ON billing_transactions(user_id, created_at DESC);
CREATE INDEX idx_billing_request ON billing_transactions(request_id);
CREATE INDEX idx_billing_status ON billing_transactions(status) WHERE status = 'pending';

CREATE TRIGGER update_billing_updated_at
  BEFORE UPDATE ON billing_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Usage aggregation (materialized for fast queries)
CREATE TABLE IF NOT EXISTS usage_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  model_slug VARCHAR(100) NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  total_input_tokens BIGINT NOT NULL DEFAULT 0,
  total_output_tokens BIGINT NOT NULL DEFAULT 0,
  total_cost BIGINT NOT NULL DEFAULT 0,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, model_slug)
);

CREATE INDEX idx_usage_daily_user ON usage_daily(user_id, date DESC);
