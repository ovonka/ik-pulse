CREATE TABLE IF NOT EXISTS observability_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  transaction_source_id UUID REFERENCES transaction_sources(id) ON DELETE SET NULL,

  metric_type TEXT NOT NULL CHECK (
    metric_type IN (
      'source_to_platform_latency',
      'platform_to_provider_latency',
      'end_to_end_transaction_latency',
      'event_ingestion_latency',
      'retry_count',
      'duplicate_event_count',
      'error_rate'
    )
  ),

  service TEXT,
  provider TEXT,
  transaction_type TEXT,

  metric_value NUMERIC(12,2) NOT NULL,
  metric_unit TEXT NOT NULL,
  observed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_observability_metrics_merchant_id ON observability_metrics(merchant_id);
CREATE INDEX idx_observability_metrics_branch_id ON observability_metrics(branch_id);
CREATE INDEX idx_observability_metrics_source_id ON observability_metrics(transaction_source_id);
CREATE INDEX idx_observability_metrics_type ON observability_metrics(metric_type);
CREATE INDEX idx_observability_metrics_service ON observability_metrics(service);
CREATE INDEX idx_observability_metrics_observed_at ON observability_metrics(observed_at DESC);