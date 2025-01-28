import { Request, Response, NextFunction } from 'express';
import * as mongodb from 'mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';
import { collections } from '../utils/db/connectToDb.js';

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.jwt; // get token from cookies
  const secret = config.get<string>('jwt.secret');

  if (!token) {
    res.status(401).json({ error: 'Unauthorized - No Token Provided' });
    return;
  }

  const decoded = jwt.verify(token, secret) as JwtPayload;

  const user = await collections.users?.findOne(
    { _id: mongodb.ObjectId.createFromHexString(decoded.userId) },
    { projection: { password: 0 } }
  );

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  req.user = user;
  next();
};
