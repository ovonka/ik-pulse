CREATE TABLE IF NOT EXISTS observability_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  transaction_source_id UUID REFERENCES transaction_sources(id) ON DELETE SET NULL,

  service TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR')),
  message TEXT NOT NULL,

  event_id TEXT,
  reference_id TEXT,
  idempotency_key TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_observability_logs_merchant_id ON observability_logs(merchant_id);
CREATE INDEX idx_observability_logs_branch_id ON observability_logs(branch_id);
CREATE INDEX idx_observability_logs_source_id ON observability_logs(transaction_source_id);
CREATE INDEX idx_observability_logs_service ON observability_logs(service);
CREATE INDEX idx_observability_logs_level ON observability_logs(level);
CREATE INDEX idx_observability_logs_created_at ON observability_logs(created_at DESC);