import * as mongodb from 'mongodb';

export interface Conversation {
  _id?: mongodb.ObjectId;
  participants: mongodb.ObjectId[]; // array of User _ids
  messages: mongodb.ObjectId[]; // array of message _ids
  createdAt?: Date;
  updatedAt: Date;
}

export const conversationSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['participants', 'messages', 'createdAt', 'updatedAt'],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique id for a messaage in the database'
      },
      participants: {
        bsonType: 'array',
        description: 'An array of ObjectIds referencing participants in the conversation',
        items: {
          bsonType: 'objectId',
          description: 'ObjectId of a user participating in the conversation'
        }
      },
      messages: {
        bsonType: 'array',
        description: 'An array of ObjectIds referencing messages in the conversation',
        items: {
          bsonType: 'objectId',
          description: 'ObjectId of a message associated with the conversation'
        }
      },
      createdAt: {
        bsonType: 'date',
        description: 'Date the conversation was created',
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Date when the conversation was last updated',
      },
    }
  }
}

