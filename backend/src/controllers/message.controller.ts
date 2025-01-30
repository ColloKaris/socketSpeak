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
  fetchMessage,
} from '../services/message.service.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { Message } from '../models/message.model.js';

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

  let sentMessage: mongodb.WithId<Message>;

  if (
    updateResult?.acknowledged &&
    updateResult.matchedCount > 0 &&
    updateResult.modifiedCount > 0
  ) {
    const result = await fetchMessage(messageResult.insertedId);
    if (result) {
      sentMessage = result;
    } else {
      throw new ExpressError('Could not fetch new message',500)
    };

    // Once messages has been added to the database, send it to the other user, using Socket.io
    const receiverSocketId =  getReceiverSocketId(receiverId.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', sentMessage)
    }

    res.status(201).json(sentMessage);
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
    res.status(200).json([]);
    return;
  };

  const populatedConversation = await populateMessages(conversation._id);
  if(!populatedConversation) {
    throw new ExpressError('Could not populate messages in the conversation', 500)
  };

  // Extract all chat Messages in the conversation
  const messages = populatedConversation.map(conv => conv.chatMessages);
  res.status(200).json( messages );
};