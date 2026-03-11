import { z } from 'zod';

export const simulateActionSchema = z.object({
  action: z.enum([
    'success_payment',
    'failed_payment',
    'pending_payment',
    'burst_traffic',
  ]),
});

export type SimulateActionInput = z.infer<typeof simulateActionSchema>;