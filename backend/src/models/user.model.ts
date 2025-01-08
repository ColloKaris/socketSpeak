import * as mongodb from 'mongodb';

export interface User {
  _id?: mongodb.ObjectId;
  fullName: string;
  username: string;
  password: string;
  gender: string;
  profilePic: string;
  createdAt?: Date;
  updatedAt: Date;
}

export const userSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'fullName',
      'username',
      'password',
      'gender',
      'createdAt',
      'updatedAt',
    ],
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique id for a user in MongoDb'
      },
      fullName: {
        bsonType: 'string',
        description: 'Fullname for the user'
      },
      username: {
        bsonType: 'string',
        description: 'Username for the user'
      },
      password: {
        bsonType: 'string',
        description: 'Encrypted password for the user'
      },
      gender: {
        bsonType: 'string',
        description: 'Gender for the user'
      },
      profilePic: {
        bsonType: 'string',
        description: 'A url to the profile pic'
      },
      createdAt: {
        bsonType: 'date',
        description: 'Date the user was created',
      },
      updatedAt: {
        bsonType: 'date',
        description: 'Date when the user was last updated',
      }
    }
  },
};
