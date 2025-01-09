import { z } from 'zod';

export const authZodSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is Required'),
})