import { z } from 'zod';

export const getSettlementsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['pending', 'completed', 'delayed']).optional(),
  search: z.string().trim().optional(),
});

export type GetSettlementsQuery = z.infer<typeof getSettlementsQuerySchema>;