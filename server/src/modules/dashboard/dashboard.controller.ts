import type { Request, Response } from 'express';
import * as dashboardService from './dashboard.service.js';
import { resolveMerchantScope } from '../../utils/resolveMerchantScope.js';

export async function getDashboardOverviewController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const overview = await dashboardService.getDashboardOverviewForMerchant(merchantId);

  return res.status(200).json(overview);
}