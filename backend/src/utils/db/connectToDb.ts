import * as mongodb from 'mongodb';

import { User } from '../../models/user.model.js';
import { Message } from '../../models/message.model.js';
import { Conversation } from '../../models/conversation.model.js';
import { applySchemaValidation } from './applySchemaValidation.js';

// Hold references to collections
export const collections: {
  users?: mongodb.Collection<User>;
  messages?: mongodb.Collection<Message>;
  conversations?: mongodb.Collection<Conversation>;
} = {};

// Connect to the database
export async function connectToDatabase(dbUri: string) {
  const client = new mongodb.MongoClient(dbUri);
  await client.connect();

  const db = client.db('socketSpeak'); // create db instance, specify dbName
  await applySchemaValidation(db);
  
  collections.users = db.collection<User>('users');
  collections.messages = db.collection<Message>('messages');
  collections.conversations = db.collection<Conversation>('conversations');

  return client;
}
