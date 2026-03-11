import type { Request, Response } from 'express';
import * as dashboardService from './dashboard.service.js';

export async function getDashboardOverviewController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const overview = await dashboardService.getDashboardOverviewForMerchant(
    authUser.merchantId
  );

  return res.status(200).json(overview);
}