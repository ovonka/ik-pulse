CREATE TABLE IF NOT EXISTS transaction_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,

  source_type TEXT NOT NULL CHECK (
    source_type IN ('physical_terminal', 'online_entity', 'api_channel', 'integration_endpoint')
  ),

  machine_id TEXT,
  terminal_id TEXT,
  entity_id TEXT,
  display_name TEXT NOT NULL,

  provider TEXT NOT NULL,
  provider_source_ref TEXT,
  status TEXT NOT NULL DEFAULT 'online'
    CHECK (status IN ('online', 'offline', 'inactive')),
  last_seen_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transaction_sources_merchant_id ON transaction_sources(merchant_id);
CREATE INDEX idx_transaction_sources_branch_id ON transaction_sources(branch_id);
CREATE INDEX idx_transaction_sources_machine_id ON transaction_sources(machine_id);
CREATE INDEX idx_transaction_sources_entity_id ON transaction_sources(entity_id);
CREATE INDEX idx_transaction_sources_status ON transaction_sources(status);
CREATE INDEX idx_transaction_sources_provider ON transaction_sources(provider);