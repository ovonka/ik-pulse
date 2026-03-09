CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  transaction_source_id UUID REFERENCES transaction_sources(id) ON DELETE SET NULL,

  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_id TEXT NOT NULL,
  idempotency_key TEXT,
  reference_id TEXT,

  payload JSONB NOT NULL,
  processing_status TEXT NOT NULL CHECK (
    processing_status IN ('received', 'processed', 'duplicate', 'failed')
  ),

  received_at TIMESTAMP NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX idx_webhook_events_merchant_id ON webhook_events(merchant_id);
CREATE INDEX idx_webhook_events_branch_id ON webhook_events(branch_id);
CREATE INDEX idx_webhook_events_source_id ON webhook_events(transaction_source_id);
CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX idx_webhook_events_idempotency_key ON webhook_events(idempotency_key);
CREATE INDEX idx_webhook_events_processing_status ON webhook_events(processing_status);