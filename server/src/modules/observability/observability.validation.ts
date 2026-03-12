import { z } from 'zod';

export const getObservabilityQuerySchema = z.object({
  range: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
});

export type GetObservabilityQuery = z.infer<typeof getObservabilityQuerySchema>;