import type { Request } from 'express';

const INTERNAL_ROLES = new Set(['admin', 'support', 'qa']);

export function resolveMerchantScope(req: Request): string | null {
  const authUser = req.authUser;

  if (!authUser) {
    return null;
  }

  const requestedMerchantId =
    typeof req.query.merchantId === 'string'
      ? req.query.merchantId
      : typeof req.body?.merchantId === 'string'
        ? req.body.merchantId
        : null;

  if (INTERNAL_ROLES.has(authUser.role) && requestedMerchantId) {
    return requestedMerchantId;
  }

  return authUser.merchantId ?? null;
}