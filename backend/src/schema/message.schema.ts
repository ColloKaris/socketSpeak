import { z } from 'zod';
import { ObjectId } from 'mongodb';

const objectIdSchema = z.instanceof(ObjectId);

export const createMessageSchema = z.object({
  _id: objectIdSchema.optional(),
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  message: z.string().min(1, "Message cannot be empty"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})