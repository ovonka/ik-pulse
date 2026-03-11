import type { Request, Response } from 'express';
import { resolveMerchantScope } from '../../utils/resolveMerchantScope.js';
import { simulateActionSchema } from './simulator.validation.js';
import * as simulatorService from './simulator.service.js';

export async function simulateActionController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = simulateActionSchema.parse(req.body);

  const result = await simulatorService.simulateMerchantAction({
    merchantId,
    action: parsed.action,
  });

  return res.status(200).json(result);
}