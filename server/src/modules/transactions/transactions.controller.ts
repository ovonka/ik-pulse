import type { Request, Response } from 'express';
import {
  getTransactionsQuerySchema,
  retryTransactionParamsSchema,
} from './transactions.validation.js';
import * as transactionsService from './transactions.service.js';
import { resolveMerchantScope } from '../../utils/resolveMerchantScope.js';

export async function getTransactionsController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = getTransactionsQuerySchema.parse(req.query);

  const result = await transactionsService.getTransactionsForMerchant(
    merchantId,
    parsed
  );

  return res.status(200).json(result);
}

export async function getTransactionSummaryController(req: Request, res: Response) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const summary = await transactionsService.getTransactionSummaryForMerchant(merchantId);

  return res.status(200).json(summary);
}

export async function retryTransactionController(
  req: Request<{ transactionId: string }>,
  res: Response
) {
  const merchantId = resolveMerchantScope(req);

  if (!merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = retryTransactionParamsSchema.parse(req.params);

  const result = await transactionsService.retryFailedTransactionForMerchant({
    merchantId,
    transactionId: parsed.transactionId,
  });

  return res.status(200).json(result);
}