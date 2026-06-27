import { z } from 'zod';

export const CreateHighlightedIpSchema = z.object({
  ip_address: z.string().ip({ message: 'Must be a valid IPv4 or IPv6 address' }),
  reason: z.string().optional(),
});

export type CreateHighlightedIpRequest = z.infer<typeof CreateHighlightedIpSchema>;

export const UpdateHighlightedIpSchema = z.object({
  ip_address: z.string().ip({ message: 'Must be a valid IPv4 or IPv6 address' }),
  reason: z.string().optional(),
});

export type UpdateHighlightedIpRequest = z.infer<typeof UpdateHighlightedIpSchema>;

export const ParamIdSchema = z.preprocess((val) => Number(val), z.number().int().positive({ message: 'ID must be a positive integer' }));
