import { z } from 'zod';

export const getTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(['success', 'failed', 'pending']).optional(),
  search: z.string().trim().optional(),
});

export const retryTransactionParamsSchema = z.object({
  transactionId: z.string().uuid(),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
export type RetryTransactionParams = z.infer<typeof retryTransactionParamsSchema>;