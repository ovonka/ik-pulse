CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  transaction_source_id UUID REFERENCES transaction_sources(id) ON DELETE SET NULL,

  provider TEXT NOT NULL,
  provider_transaction_ref TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,

  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',

  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  transaction_type TEXT NOT NULL DEFAULT 'card_payment',
  payment_method TEXT,
  failure_reason TEXT,

  initiated_at TIMESTAMP,
  received_at TIMESTAMP,
  completed_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_branch_id ON transactions(branch_id);
CREATE INDEX idx_transactions_source_id ON transactions(transaction_source_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_provider ON transactions(provider);