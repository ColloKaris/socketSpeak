import * as mongodb from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongodb.ObjectId;
        fullName: string;
        username: string;
        password?: string;
        gender: string;
        profilePic: string;
        createdAt?: Date;
        updatedAt: Date;
      };
    }
  }
}
