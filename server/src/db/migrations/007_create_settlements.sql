CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  transaction_source_id UUID REFERENCES transaction_sources(id) ON DELETE SET NULL,

  provider TEXT NOT NULL,
  provider_settlement_ref TEXT,

  gross_amount NUMERIC(12,2) NOT NULL,
  fee_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL,

  transaction_count INTEGER NOT NULL DEFAULT 0,

  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'delayed')),
  scheduled_for TIMESTAMP NOT NULL,
  settled_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settlements_merchant_id ON settlements(merchant_id);
CREATE INDEX idx_settlements_branch_id ON settlements(branch_id);
CREATE INDEX idx_settlements_source_id ON settlements(transaction_source_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_settlements_scheduled_for ON settlements(scheduled_for DESC);