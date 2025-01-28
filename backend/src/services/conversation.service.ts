import * as mongodb from 'mongodb';
import { ExpressError } from '../utils/ExpressError.js';
import { collections } from '../utils/db/connectToDb.js';
import { addTimeStamps } from '../utils/db/addTimeStamps.js';

// find conversation based on participants
export async function findConversation(...participantIds: mongodb.ObjectId[]) {
  if (participantIds.length === 0) {
    throw new ExpressError('Provide at least One participant to get conversation', 400);
  }
  const conversation = await collections.conversations?.findOne({participants: {$all: participantIds}});
  return conversation;
};

// find conversation based on the conversation id
export async function findConversationUsingId(conversationId: mongodb.ObjectId) {
  const conversation = await collections.conversations?.findOne({_id: mongodb.ObjectId});
  return conversation;
}

// create a conversation
export async function createConversation(...participantIds: mongodb.ObjectId[]) {
  let conversation = {
    participants: participantIds,
    messages:[],
  }
  const timeStampedConversation = addTimeStamps(conversation);
  const result = await collections.conversations?.insertOne(timeStampedConversation);
  return result;
};