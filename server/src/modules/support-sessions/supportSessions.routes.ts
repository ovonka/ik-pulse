import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  consumeSupportCodeController,
  createSupportSessionController,
  getActiveSupportSessionController,
  resolveSupportSessionController,
  revokeSupportSessionController,
} from './supportSessions.controller.js';

const supportSessionsRouter = Router();

supportSessionsRouter.get(
  '/current',
  authenticate,
  authorize('merchant'),
  asyncHandler(getActiveSupportSessionController)
);

supportSessionsRouter.post(
  '/',
  authenticate,
  authorize('merchant'),
  asyncHandler(createSupportSessionController)
);

supportSessionsRouter.post(
  '/revoke',
  authenticate,
  authorize('merchant'),
  asyncHandler(revokeSupportSessionController)
);

supportSessionsRouter.post(
  '/consume',
  authenticate,
  authorize('admin', 'support', 'qa'),
  asyncHandler(consumeSupportCodeController)
);

supportSessionsRouter.post(
  '/:merchantId/resolve',
  authenticate,
  authorize('admin', 'support', 'qa'),
  asyncHandler<{ merchantId: string }>(resolveSupportSessionController)
);

export default supportSessionsRouter;