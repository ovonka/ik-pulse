import type { Request, Response } from 'express';
import { getSettlementsQuerySchema } from './settlements.validation.js';
import * as settlementsService from './settlements.service.js';
import { resolveMerchantScope } from '../../utils/resolveMerchantScope.js';

export async function getSettlementsController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = getSettlementsQuerySchema.parse(req.query);

  const result = await settlementsService.getSettlementsForMerchant(
    merchantId,
    parsed
  );

  return res.status(200).json(result);
}

export async function getSettlementSummaryController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const summary = await settlementsService.getSettlementSummaryForMerchant(merchantId);

  return res.status(200).json(summary);
}