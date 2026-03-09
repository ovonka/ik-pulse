import { pool } from '../../config/db.js';
import type { AuthTokenPayload } from '../../utils/jwt.js';
import type {
  ConsumedSupportSessionResponse,
  SupportSessionRecord,
  SupportSessionResponse,
} from './supportSessions.types.js';

function generateSupportCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function createExpiryDate(minutes: number) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function toSupportSessionResponse(record: SupportSessionRecord): SupportSessionResponse {
  return {
    id: record.id,
    merchantId: record.merchant_id,
    branchId: record.branch_id,
    supportCode: record.support_code,
    status: record.status,
    accessScope: record.access_scope,
    reason: record.reason,
    expiresAt: record.expires_at,
    consumedAt: record.consumed_at,
    revokedAt: record.revoked_at,
    createdAt: record.created_at,
  };
}

export async function getActiveSupportSessionForMerchant(
  merchantId: string
): Promise<SupportSessionResponse | null> {
  const result = await pool.query<SupportSessionRecord>(
    `
    SELECT *
    FROM support_sessions
    WHERE merchant_id = $1
      AND status = 'active'
      AND expires_at > NOW()
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [merchantId]
  );

  const session = result.rows[0];
  return session ? toSupportSessionResponse(session) : null;
}

export async function createSupportSession(params: {
  authUser: AuthTokenPayload;
  reason: string;
  accessScope: 'read_only' | 'elevated';
  branchId?: string | null;
}): Promise<SupportSessionResponse> {
  const { authUser, reason, accessScope, branchId } = params;

  if (!authUser.merchantId) {
    throw new Error('Merchant scope is required');
  }

  const existing = await getActiveSupportSessionForMerchant(authUser.merchantId);

  if (existing) {
    return existing;
  }

  const supportCode = generateSupportCode();
  const expiresAt = createExpiryDate(30);

  const result = await pool.query<SupportSessionRecord>(
    `
    INSERT INTO support_sessions (
      merchant_id,
      branch_id,
      support_code,
      status,
      access_scope,
      created_by_user_id,
      reason,
      expires_at
    )
    VALUES ($1, $2, $3, 'active', $4, $5, $6, $7)
    RETURNING *
    `,
    [
      authUser.merchantId,
      branchId ?? authUser.branchId ?? null,
      supportCode,
      accessScope,
      authUser.sub,
      reason,
      expiresAt,
    ]
  );

  await pool.query(
    `
    INSERT INTO support_audit_logs (support_session_id, actor_user_id, action, details)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    [
      result.rows[0].id,
      authUser.sub,
      'support_session_created',
      JSON.stringify({
        reason,
        accessScope,
      }),
    ]
  );

  return toSupportSessionResponse(result.rows[0]);
}

export async function revokeSupportSession(params: {
  merchantId: string;
  actorUserId: string;
}): Promise<SupportSessionResponse | null> {
  const result = await pool.query<SupportSessionRecord>(
    `
    UPDATE support_sessions
    SET status = 'revoked',
        revoked_at = NOW()
    WHERE merchant_id = $1
      AND status = 'active'
      AND expires_at > NOW()
    RETURNING *
    `,
    [params.merchantId]
  );

  const session = result.rows[0];

  if (!session) {
    return null;
  }

  await pool.query(
    `
    INSERT INTO support_audit_logs (support_session_id, actor_user_id, action, details)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    [
      session.id,
      params.actorUserId,
      'support_session_revoked',
      JSON.stringify({}),
    ]
  );

  return toSupportSessionResponse(session);
}

export async function consumeSupportCode(params: {
  supportCode: string;
  authUser: AuthTokenPayload;
}): Promise<ConsumedSupportSessionResponse> {
  const { supportCode, authUser } = params;

  const result = await pool.query<SupportSessionRecord>(
    `
    SELECT *
    FROM support_sessions
    WHERE support_code = $1
    LIMIT 1
    `,
    [supportCode]
  );

  const session = result.rows[0];

  if (!session) {
    throw new Error('Support code not found');
  }

  if (session.status === 'revoked') {
    throw new Error('Support code has been revoked');
  }

  if (session.status === 'used') {
    throw new Error('Support code has already been used');
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    await pool.query(
      `
      UPDATE support_sessions
      SET status = 'expired'
      WHERE id = $1
      `,
      [session.id]
    );

    throw new Error('Support code has expired');
  }

  const consumedResult = await pool.query<SupportSessionRecord>(
    `
    UPDATE support_sessions
    SET status = 'used',
        consumed_by_user_id = $1,
        consumed_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [authUser.sub, session.id]
  );

  const consumedSession = consumedResult.rows[0];

  await pool.query(
    `
    INSERT INTO support_audit_logs (support_session_id, actor_user_id, action, details)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    [
      consumedSession.id,
      authUser.sub,
      'support_session_consumed',
      JSON.stringify({
        supportCode,
        internalRole: authUser.role,
      }),
    ]
  );

  return {
    session: toSupportSessionResponse(consumedSession),
    merchantContext: {
      merchantId: consumedSession.merchant_id,
      branchId: consumedSession.branch_id,
    },
  };
}