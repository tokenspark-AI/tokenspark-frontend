-- =====================================================
-- TokenSpark Seed Data
-- =====================================================

-- Providers
INSERT INTO providers (id, slug, display_name, base_url, api_key_encrypted, health_status, priority) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'openai', 'OpenAI', 'https://api.openai.com', 'encrypted:oai_key_here', 'healthy', 10),
  ('a0000000-0000-0000-0000-000000000002', 'anthropic', 'Anthropic', 'https://api.anthropic.com', 'encrypted:anthropic_key_here', 'healthy', 20),
  ('a0000000-0000-0000-0000-000000000003', 'google', 'Google', 'https://generativelanguage.googleapis.com', 'encrypted:google_key_here', 'healthy', 30),
  ('a0000000-0000-0000-0000-000000000004', 'mistral', 'Mistral AI', 'https://api.mistral.ai', 'encrypted:mistral_key_here', 'healthy', 40),
  ('a0000000-0000-0000-0000-000000000005', 'meta', 'Meta (Llama)', 'https://api.llama-api.com', 'encrypted:meta_key_here', 'healthy', 50)
ON CONFLICT (slug) DO NOTHING;

-- Models
INSERT INTO models (id, slug, display_name, provider_id, provider_model_id, input_price_per_million, output_price_per_million, context_window, max_output_tokens, capabilities) VALUES
  -- OpenAI
  ('b0000000-0000-0000-0000-000000000001', 'gpt-4.1', 'GPT-4.1', 'a0000000-0000-0000-0000-000000000001', 'gpt-4.1', 200, 800, 1048576, 32768, '["chat", "vision", "function_calling"]'),
  ('b0000000-0000-0000-0000-000000000002', 'gpt-4o', 'GPT-4o', 'a0000000-0000-0000-0000-000000000001', 'gpt-4o', 250, 1000, 128000, 16384, '["chat", "vision", "function_calling"]'),
  ('b0000000-0000-0000-0000-000000000003', 'gpt-4o-mini', 'GPT-4o Mini', 'a0000000-0000-0000-0000-000000000001', 'gpt-4o-mini', 15, 60, 128000, 16384, '["chat", "function_calling"]'),

  -- Anthropic
  ('b0000000-0000-0000-0000-000000000004', 'claude-3-opus', 'Claude 3 Opus', 'a0000000-0000-0000-0000-000000000002', 'claude-3-opus-20240229', 1500, 7500, 200000, 4096, '["chat", "vision", "function_calling"]'),
  ('b0000000-0000-0000-0000-000000000005', 'claude-3-sonnet', 'Claude 3 Sonnet', 'a0000000-0000-0000-0000-000000000002', 'claude-3-sonnet-20240229', 300, 1500, 200000, 4096, '["chat", "vision", "function_calling"]'),
  ('b0000000-0000-0000-0000-000000000006', 'claude-3-haiku', 'Claude 3 Haiku', 'a0000000-0000-0000-0000-000000000002', 'claude-3-haiku-20240307', 25, 125, 200000, 4096, '["chat", "function_calling"]'),

  -- Google
  ('b0000000-0000-0000-0000-000000000007', 'gemini-pro', 'Gemini Pro', 'a0000000-0000-0000-0000-000000000003', 'gemini-pro', 125, 500, 1000000, 32768, '["chat", "vision"]'),
  ('b0000000-0000-0000-0000-000000000008', 'gemini-1.5-flash', 'Gemini 1.5 Flash', 'a0000000-0000-0000-0000-000000000003', 'gemini-1.5-flash', 75, 300, 1000000, 8192, '["chat", "vision"]'),

  -- Mistral
  ('b0000000-0000-0000-0000-000000000009', 'mistral-large', 'Mistral Large', 'a0000000-0000-0000-0000-000000000004', 'mistral-large-latest', 200, 600, 32000, 8192, '["chat", "function_calling"]'),
  ('b0000000-0000-0000-0000-000000000010', 'mistral-small', 'Mistral Small', 'a0000000-0000-0000-0000-000000000004', 'mistral-small-latest', 20, 60, 32000, 8192, '["chat"]'),

  -- Meta / Llama
  ('b0000000-0000-0000-0000-000000000011', 'llama-3-70b', 'Llama 3 70B', 'a0000000-0000-0000-0000-000000000005', 'llama-3-70b', 90, 90, 8192, 4096, '["chat"]'),
  ('b0000000-0000-0000-0000-000000000012', 'llama-3-8b', 'Llama 3 8B', 'a0000000-0000-0000-0000-000000000005', 'llama-3-8b', 5, 5, 8192, 4096, '["chat"]')
ON CONFLICT (slug) DO NOTHING;

-- Test User
INSERT INTO users (id, email, name, user_type, status, referral_code) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'demo@tokenspark.io', 'Demo User', 'individual', 'active', 'DEMO2026')
ON CONFLICT (id) DO NOTHING;

-- Test User Wallet
INSERT INTO wallets (user_id, currency, balance, reserved_balance, version) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'USD', 1000000, 0, 0)  -- $10,000 demo balance
ON CONFLICT (user_id, currency) DO NOTHING;

-- System accounts for ledger
INSERT INTO users (id, email, name, user_type, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'system@tokenspark.io', 'System Revenue', 'individual', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'provider@tokenspark.io', 'Provider Pool', 'individual', 'active')
ON CONFLICT (id) DO NOTHING;
