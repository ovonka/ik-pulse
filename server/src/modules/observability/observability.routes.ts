import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { getObservabilityOverviewController } from './observability.controller.js';

const observabilityRouter = Router();

observabilityRouter.get(
  '/overview',
  authenticate,
  authorize('admin', 'support', 'qa'),
  asyncHandler(getObservabilityOverviewController)
);

export default observabilityRouter;