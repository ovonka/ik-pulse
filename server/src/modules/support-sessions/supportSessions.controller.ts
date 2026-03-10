import type { Request, Response } from 'express';
import {
  consumeSupportCodeSchema,
  createSupportSessionSchema,
  resolveSupportSessionSchema,
} from './supportSessions.validation.js';
import * as supportSessionsService from './supportSessions.service.js';

export async function getActiveSupportSessionController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const session = await supportSessionsService.getActiveSupportSessionForMerchant(
    authUser.merchantId
  );

  return res.status(200).json({ session });
}

export async function createSupportSessionController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const parsed = createSupportSessionSchema.parse(req.body);

  const session = await supportSessionsService.createSupportSession({
    authUser,
    reason: parsed.reason,
    accessScope: parsed.accessScope,
    branchId: parsed.branchId ?? null,
  });

  return res.status(201).json({ session });
}

export async function revokeSupportSessionController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser?.merchantId) {
    return res.status(403).json({ message: 'Merchant scope is required' });
  }

  const session = await supportSessionsService.revokeSupportSession({
    merchantId: authUser.merchantId,
    actorUserId: authUser.sub,
  });

  return res.status(200).json({ session });
}

export async function consumeSupportCodeController(req: Request, res: Response) {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const parsed = consumeSupportCodeSchema.parse(req.body);

  const result = await supportSessionsService.consumeSupportCode({
    supportCode: parsed.supportCode,
    authUser,
  });

  return res.status(200).json(result);
}

export async function resolveSupportSessionController(
  req: Request<{ merchantId: string }>,
  res: Response
) {
  const authUser = req.authUser;

  if (!authUser) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const parsed = resolveSupportSessionSchema.parse(req.body);
  const { merchantId } = req.params;

  const session = await supportSessionsService.resolveSupportSession({
    merchantId,
    actorUserId: authUser.sub,
    resolutionNote: parsed.resolutionNote,
  });

  return res.status(200).json({ session });
}