import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { getDashboardOverviewController } from './dashboard.controller.js';

const dashboardRouter = Router();

dashboardRouter.get(
  '/overview',
  authenticate,
  authorize('merchant', 'admin', 'support', 'qa'),
  asyncHandler(getDashboardOverviewController)
);

export default dashboardRouter;