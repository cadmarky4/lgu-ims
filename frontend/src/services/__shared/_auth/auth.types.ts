import { z } from 'zod';

export const LoginCredentialsRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),

  rememberMe: z.boolean().optional(),
});

export const MiniUserSchema = z.object({
  id: z.number(),

  email: z.string().email(),
  name: z.string(),

  created_at: z.string(),
  updated_at: z.string(),
});

export const LoginResponseSchema = z.object({
  user: MiniUserSchema,
  token: z.string(),
});

export type LoginCredentialsRequest = z.infer<typeof LoginCredentialsRequestSchema>;
export type MiniUser = z.infer<typeof MiniUserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;