import { Request, Response, NextFunction } from 'express';
import * as mongodb from 'mongodb';
import {
  createConversation,
  findConversation,
  findConversationUsingId,
  populateMessages,
} from '../services/conversation.service.js';
import { ExpressError } from '../utils/ExpressError.js';
import { addTimeStamps } from '../utils/db/addTimeStamps.js';
import {
  addMessageToConversation,
  createMessage,
} from '../services/message.service.js';

export const sendMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  let { id } = req.params;
  const receiverId = new mongodb.ObjectId(id);

  if (!req.user || !req.user._id) {
    throw new ExpressError('User is not authenticated or lacks an ID.', 400);
  }
  const senderId = req.user._id;

  // Step 1: find conversation between the 2 users
  let conversation = await findConversation(receiverId, senderId);
  if (!conversation) {
    const result = await createConversation(receiverId, senderId);
    if (!result?.acknowledged) {
      throw new ExpressError('Could not create a new conversation', 500);
    }
    conversation = await findConversationUsingId(result?.insertedId);
  }

  if (!conversation?._id) {
    throw new Error('Conversation ID is not available.');
  }

  // Step 2: Create a new message
  const newMessage = addTimeStamps({ senderId, receiverId, message });
  const messageResult = await createMessage(newMessage);

  if (!messageResult?.acknowledged) {
    throw new ExpressError('Failed to create the message', 500);
  }

  // Step 3: Add the message to the conversation
  const conversationId = conversation._id;
  const updateResult = await addMessageToConversation(
    conversationId,
    messageResult.insertedId
  );

  if (
    updateResult?.acknowledged &&
    updateResult.matchedCount > 0 &&
    updateResult.modifiedCount > 0
  ) {
    res.status(201).json({ messageId: messageResult.insertedId });
  } else {
    throw new ExpressError(
      'Failed to update conversation with the new message',
      500
    );
  };
};

export const getMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userToChatId = new mongodb.ObjectId(id);

  if (!req.user || !req.user._id) {
    throw new ExpressError('User is not authenticated or lacks an ID.', 400);
  };
  const senderId = req.user._id;

  const conversation = await findConversation(senderId, userToChatId);
  if (!conversation) {
    throw new ExpressError('The conversation is not available.', 400);
  };

  const populatedConversation = await populateMessages(conversation._id);
  if(!populatedConversation) {
    throw new ExpressError('Could not populate messages in the conversation', 500)
  };

  // Extract all chat Messages in the conversation
  const messages = populatedConversation.map(conv => conv.chatMessages);

  res.status(200).json( messages );
};