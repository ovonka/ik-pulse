import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getTransactionSummaryController,
  getTransactionsController,
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

export default transactionsRouter;