import { z } from 'zod';

export const GetFilteredAlertsSchema = z.object({
  department: z.string().optional(),
  risk: z.string().optional(),
  page: z.preprocess((val) => Number(val || 1), z.number().min(1)).default(1),
  limit: z.preprocess((val) => Number(val || 20), z.number().min(1).max(100)).default(20),
});

export type GetFilteredAlertsRequest = z.infer<typeof GetFilteredAlertsSchema>;
