import type { Request, Response } from 'express';
import { resolveMerchantScope } from '../../utils/resolveMerchantScope.js';
import { getObservabilityQuerySchema } from './observability.validation.js';
import * as observabilityService from './observability.service.js';

export async function getObservabilityOverviewController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = getObservabilityQuerySchema.parse(req.query);

  const result = await observabilityService.getObservabilityOverviewForMerchant(
    merchantId,
    parsed
  );

  return res.status(200).json(result);
}