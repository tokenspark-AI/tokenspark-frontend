-- =====================================================
-- TokenSpark Database Migration 003: Providers & Models
-- =====================================================

-- AI Providers
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  api_key_encrypted TEXT NOT NULL,
  rate_limit_rpm INTEGER,
  rate_limit_tpm INTEGER,
  health_status VARCHAR(20) DEFAULT 'healthy'
    CHECK (health_status IN ('healthy', 'degraded', 'down', 'maintenance')),
  avg_latency_ms INTEGER DEFAULT 0,
  success_rate NUMERIC(5,4) DEFAULT 1.0,
  priority INTEGER DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Model pricing catalog
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  provider_id UUID NOT NULL REFERENCES providers(id),
  provider_model_id VARCHAR(255) NOT NULL,
  input_price_per_million BIGINT NOT NULL DEFAULT 0,
  output_price_per_million BIGINT NOT NULL DEFAULT 0,
  context_window INTEGER NOT NULL,
  max_output_tokens INTEGER,
  capabilities JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_models_provider ON models(provider_id);
CREATE INDEX idx_models_slug ON models(slug) WHERE is_active = true;

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
