import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getTransactionSummaryController,
  getTransactionsController,
  retryTransactionController,
} from './transactions.controller.js';

const transactionsRouter = Router();

transactionsRouter.get(
  '/',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler(getTransactionsController)
);

transactionsRouter.get(
  '/summary',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler(getTransactionSummaryController)
);

transactionsRouter.post(
  '/:transactionId/retry',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler<{ transactionId: string }>(retryTransactionController)
);

export default transactionsRouter;