import * as mongodb from 'mongodb';

export interface Message {
  _id?: mongodb.ObjectId;
  senderId: mongodb.ObjectId;
  receiverId: mongodb.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt: Date;
}

export const messageSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'senderId',
      'receiverId',
      'message',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique id for a messaage in the database'
      },
      senderId: {
        bsonType: 'objectId',
        description: '_id field of the sender of the message'
      },
      receiverId: {
        bsonType: 'objectId',
        description: '_id field of the recipeint of the message'
      },
      createdAt: {
        bsonType: 'date',
        description: 'Date the message was created',
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Date when the message was last updated',
      }
    }
  }
}