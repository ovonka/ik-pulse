import type { Request, Response } from 'express';
import { getSettlementsQuerySchema } from './settlements.validation.js';
import * as settlementsService from './settlements.service.js';

export async function getSettlementsController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = getSettlementsQuerySchema.parse(req.query);

  const result = await settlementsService.getSettlementsForMerchant(
    authUser.merchantId,
    parsed
  );

  return res.status(200).json(result);
}

export async function getSettlementSummaryController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const summary = await settlementsService.getSettlementSummaryForMerchant(
    authUser.merchantId
  );

  return res.status(200).json(summary);
}