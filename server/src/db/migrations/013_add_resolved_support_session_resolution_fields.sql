CREATE TABLE IF NOT EXISTS support_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,

  support_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked', 'expired', 'used')),
  access_scope TEXT NOT NULL DEFAULT 'read_only' CHECK (
    access_scope IN ('read_only', 'elevated')
  ),

  created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consumed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  reason TEXT,
  expires_at TIMESTAMP NOT NULL,
  consumed_at TIMESTAMP,
  revoked_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_sessions_merchant_id ON support_sessions(merchant_id);
CREATE INDEX idx_support_sessions_branch_id ON support_sessions(branch_id);
CREATE INDEX idx_support_sessions_support_code ON support_sessions(support_code);
CREATE INDEX idx_support_sessions_status ON support_sessions(status);
CREATE INDEX idx_support_sessions_expires_at ON support_sessions(expires_at);