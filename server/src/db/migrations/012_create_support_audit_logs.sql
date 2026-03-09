CREATE TABLE IF NOT EXISTS support_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_session_id UUID NOT NULL REFERENCES support_sessions(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_audit_logs_session_id ON support_audit_logs(support_session_id);
CREATE INDEX idx_support_audit_logs_actor_user_id ON support_audit_logs(actor_user_id);
CREATE INDEX idx_support_audit_logs_created_at ON support_audit_logs(created_at DESC);