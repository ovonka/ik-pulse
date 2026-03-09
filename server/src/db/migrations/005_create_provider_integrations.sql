CREATE TABLE IF NOT EXISTS provider_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  integration_type TEXT NOT NULL CHECK (
    integration_type IN ('api', 'webhook', 'terminal_sync', 'bulk_import')
  ),
  status TEXT NOT NULL DEFAULT 'connected' CHECK (
    status IN ('connected', 'disconnected', 'error', 'pending')
  ),
  external_account_ref TEXT,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provider_integrations_merchant_id ON provider_integrations(merchant_id);
CREATE INDEX idx_provider_integrations_provider ON provider_integrations(provider);
CREATE INDEX idx_provider_integrations_status ON provider_integrations(status);