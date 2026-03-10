import { z } from 'zod';

export const createSupportSessionSchema = z.object({
  reason: z.string().trim().min(5).max(500),
  accessScope: z.enum(['read_only', 'elevated']).default('read_only'),
  branchId: z.string().uuid().nullable().optional(),
});

export const consumeSupportCodeSchema = z.object({
  supportCode: z.string().trim().min(4).max(32),
});

export const resolveSupportSessionSchema = z.object({
  resolutionNote: z.string().trim().min(5).max(1000),
});

export type CreateSupportSessionInput = z.infer<typeof createSupportSessionSchema>;
export type ConsumeSupportCodeInput = z.infer<typeof consumeSupportCodeSchema>;
export type ResolveSupportSessionInput = z.infer<typeof resolveSupportSessionSchema>;