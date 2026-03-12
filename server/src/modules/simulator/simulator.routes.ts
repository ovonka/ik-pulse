import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { simulateActionController } from './simulator.controller.js';

const simulatorRouter = Router();

simulatorRouter.post(
  '/actions',
  authenticate,
  authorize('admin', 'support', 'qa'),
  asyncHandler(simulateActionController)
);

export default simulatorRouter;