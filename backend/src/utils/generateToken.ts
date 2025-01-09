import jwt from 'jsonwebtoken';
import config from 'config';
import { Response } from 'express';
import { ObjectId } from 'mongodb';

const secret = config.get<string>('jwt.secret');
const secure = config.get<boolean>('jwt.secure')

export const generateTokenAndSetCookie = (userId: ObjectId, res: Response) => {
  const token = jwt.sign({ userId }, secret, { expiresIn: '15d' });

  res.cookie('jwt', token, {
    secure: secure,
    sameSite: true, // CSRF attacks cross-site request forgery attacks
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    maxAge: 15 * 24 * 60 * 60 * 1000,
  }); // set the token as a cookie
};