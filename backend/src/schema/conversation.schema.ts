import { z } from 'zod';
import { ObjectId } from "mongodb";

// Define a Zod object schema for MongoDB ObjectId
const objectIdSchema = z.instanceof(ObjectId);

export const conversationsZodSchema = z.object({
  _id: objectIdSchema.optional(),
  participants: z.array(objectIdSchema).min(1, "At least one participant is required"),
  messages: z.array(objectIdSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});