import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getSettlementSummaryController,
  getSettlementsController,
} from './settlements.controller.js';

const settlementsRouter = Router();

settlementsRouter.get(
  '/',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler(getSettlementsController)
);

settlementsRouter.get(
  '/summary',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler(getSettlementSummaryController)
);

export default settlementsRouter;