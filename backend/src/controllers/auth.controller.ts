import { Request, Response, NextFunction } from 'express';
import { isUsernameTaken, registerUser } from '../services/auth.service.js';
import { User } from '../models/user.model.js';
import { addTimeStamps } from '../utils/db/addTimeStamps.js';
import { ExpressError } from '../utils/ExpressError.js';

export const signup = async (req: Request, res: Response) => {
  const { fullName, username, password, gender, profilePic } = req.body;

  const isTaken = await isUsernameTaken(username);

  if (isTaken) {
    res.status(400).json({ error: 'Username already exists' });
    return;
  }

  const newUser: User = addTimeStamps({
    fullName,
    username,
    password,
    gender,
    profilePic,
  });

  const result = await registerUser(newUser);

  if (result?.acknowledged) {
    res.status(201).json({ _id: result.insertedId });
  } else {
    throw new ExpressError('COULD NOT SIGNUP A USER', 500);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {};

export const logout = (req: Request, res: Response, next: NextFunction) => {};