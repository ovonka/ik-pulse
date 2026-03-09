import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { loginController, meController } from './auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const authRouter = Router();

authRouter.post('/login', asyncHandler(loginController));
authRouter.get('/me', authenticate, asyncHandler(meController));

export default authRouter;