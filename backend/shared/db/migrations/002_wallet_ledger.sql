-- =====================================================
-- TokenSpark Database Migration 002: Wallet & Ledger
-- Financial Core — Double-Entry Bookkeeping
-- =====================================================

-- Wallet: one per user per currency
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  balance BIGINT NOT NULL DEFAULT 0,
  reserved_balance BIGINT NOT NULL DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

-- Ledger transactions: group of entries representing one financial event
CREATE TABLE IF NOT EXISTS ledger_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount BIGINT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  type VARCHAR(30) NOT NULL
    CHECK (type IN (
      'charge', 'refund', 'topup', 'withdrawal',
      'commission_payout', 'provider_settlement',
      'adjustment', 'reserve', 'release'
    )),
  status VARCHAR(20) NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ledger_txn_user ON ledger_transactions(user_id, created_at DESC);
CREATE INDEX idx_ledger_txn_type ON ledger_transactions(type);
CREATE INDEX idx_ledger_txn_idempotency ON ledger_transactions(idempotency_key);

-- Ledger entries: THE source of truth for all money movement
-- Every financial event creates exactly 2+ entries that sum to zero
CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES ledger_transactions(id) ON DELETE CASCADE,
  entry_type VARCHAR(10) NOT NULL
    CHECK (entry_type IN ('debit', 'credit')),
  account_type VARCHAR(40) NOT NULL
    CHECK (account_type IN (
      'user_wallet',
      'system_revenue',
      'provider_payable',
      'partner_commission',
      'refund_reserve',
      'fee_income',
      'adjustment',
      'payment_gateway'
    )),
  account_id UUID NOT NULL,
  amount BIGINT NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  reference_type VARCHAR(30) NOT NULL,
  reference_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ledger_entry_txn ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entry_account ON ledger_entries(account_type, account_id);
CREATE INDEX idx_ledger_entry_reference ON ledger_entries(reference_type, reference_id);
CREATE INDEX idx_ledger_entry_created ON ledger_entries(created_at DESC);

-- Balance invariant check constraint (enforced at application level per transaction)
-- SUM(debits) = SUM(credits) for every transaction_id

-- Reserved balance triggers for wallet
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
