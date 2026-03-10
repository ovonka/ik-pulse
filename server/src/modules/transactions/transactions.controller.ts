import type { Request, Response } from 'express';
import {
  getTransactionsQuerySchema,
  retryTransactionParamsSchema,
} from './transactions.validation.js';
import * as transactionsService from './transactions.service.js';

export async function getTransactionsController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = getTransactionsQuerySchema.parse(req.query);

  const result = await transactionsService.getTransactionsForMerchant(
    authUser.merchantId,
    parsed
  );

  return res.status(200).json(result);
}

export async function getTransactionSummaryController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const summary = await transactionsService.getTransactionSummaryForMerchant(
    authUser.merchantId
  );

  return res.status(200).json(summary);
}

export async function retryTransactionController(
  req: Request<{ transactionId: string }>,
  res: Response
) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const parsed = retryTransactionParamsSchema.parse(req.params);

  const result = await transactionsService.retryFailedTransactionForMerchant({
    merchantId: authUser.merchantId,
    transactionId: parsed.transactionId,
  });

  return res.status(200).json(result);
}