import { ObjectId } from 'mongodb';

import { Message } from '../models/message.model.js';
import { collections } from '../utils/db/connectToDb.js';

export async function createMessage(message: Message) {
  const result = await collections.messages?.insertOne(message);
  return result;
}

export async function fetchMessage(messageId: ObjectId) {
  const result = await collections.messages?.findOne({_id: messageId});
  return result;
}

export async function addMessageToConversation(
  conversationId: ObjectId,
  messageId: ObjectId
) {
  const now = new Date();
  const result = await collections.conversations?.updateOne(
    { _id: conversationId },
    { $set: {updatedAt: now}, $push: { messages: messageId } }
  );
  return result;
}
