import * as mongodb from 'mongodb';

import { userSchema } from '../../models/user.model.js';
import { messageSchema } from '../../models/message.model.js';
import { conversationSchema } from '../../models/conversation.model.js';

// Function to apply schema validation for different collections
export async function applySchemaValidation(db: mongodb.Db) {
  await db
    .command({ collMod: 'users', validator: userSchema })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('users', { validator: userSchema });
      }
    });

  await db
    .command({ collMod: 'messages', validator: messageSchema })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('messages', { validator: messageSchema });
      }
    });

  await db
    .command({ collMod: 'conversations', validator: conversationSchema })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('conversations', {
          validator: conversationSchema,
        });
      }
    });
  
}
