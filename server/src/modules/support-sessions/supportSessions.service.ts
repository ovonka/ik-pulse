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
  await pool.query(
    `
    UPDATE support_sessions
    SET status = 'expired'
    WHERE merchant_id = $1
      AND status IN ('active', 'used')
      AND expires_at <= NOW()
    `,
    [merchantId]
  );

  const result = await pool.query<SupportSessionRecord>(
    `
    SELECT *
    FROM support_sessions
    WHERE merchant_id = $1
      AND status IN ('active', 'used')
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
    VALUES ($1, $2, $3, 'active', $4, $5, $6, NOW() + INTERVAL '30 minutes')
    RETURNING *
    `,
    [
      authUser.merchantId,
      branchId ?? authUser.branchId ?? null,
      supportCode,
      accessScope,
      authUser.sub,
      reason,
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
      AND status IN ('active', 'used')
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

  const expiryCheck = await pool.query<{ is_expired: boolean }>(
    `
    SELECT (expires_at <= NOW()) AS is_expired
    FROM support_sessions
    WHERE id = $1
    `,
    [session.id]
  );

  if (expiryCheck.rows[0]?.is_expired) {
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

  let consumedSession: SupportSessionRecord;

  if (session.status === 'used') {
    consumedSession = session;
  } else {
    const consumedResult = await pool.query<SupportSessionRecord>(
      `
      UPDATE support_sessions
      SET status = 'used',
          consumed_by_user_id = $1,
          consumed_at = COALESCE(consumed_at, NOW())
      WHERE id = $2
      RETURNING *
      `,
      [authUser.sub, session.id]
    );

    consumedSession = consumedResult.rows[0];

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
  }

  const merchantContextResult = await pool.query<{
    merchant_id: string;
    merchant_name: string;
    branch_id: string | null;
    requested_by_email: string | null;
  }>(
    `
    SELECT
      s.merchant_id,
      m.name AS merchant_name,
      s.branch_id,
      u.email AS requested_by_email
    FROM support_sessions s
    JOIN merchants m ON m.id = s.merchant_id
    LEFT JOIN users u ON u.id = s.created_by_user_id
    WHERE s.id = $1
    LIMIT 1
    `,
    [consumedSession.id]
  );

  const merchantContext = merchantContextResult.rows[0];

  return {
    session: toSupportSessionResponse(consumedSession),
    merchantContext: {
      merchantId: merchantContext.merchant_id,
      merchantName: merchantContext.merchant_name,
      branchId: merchantContext.branch_id,
      requestedByEmail: merchantContext.requested_by_email,
    },
  };
}