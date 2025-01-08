import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Define a zod object schema for MongoDB objectId
const objectIdSchema = z.instanceof(ObjectId);

export const createUserSchema = z.object({
  _id: objectIdSchema.optional(),
  fullname: z.string().min(1, 'Full name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Your password is too short - should be 6 chars minimum'),
  gender: z.enum(['male', 'female']),
  profilePic: z.string().url('Profile picture must be a valid URL').default(''),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});
