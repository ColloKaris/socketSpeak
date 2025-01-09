import { Request, Response, NextFunction } from 'express';
import { doesUsernameExist, isUsernameTaken, registerUser } from '../services/auth.service.js';
import { User } from '../models/user.model.js';
import { addTimeStamps } from '../utils/db/addTimeStamps.js';
import { ExpressError } from '../utils/ExpressError.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { isPasswordValid } from '../utils/passwordUtils.js';

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
    generateTokenAndSetCookie(result.insertedId, res); //generate token after successfully creating a new user in the db
    res.status(201).json({ _id: result.insertedId });
  } else {
    throw new ExpressError('COULD NOT SIGNUP A USER', 500);
  }
};

export const login =  async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body;

  const validUser = await doesUsernameExist(username);
  if (!validUser) {
    res.status(400).json({error: 'Invalid Username or Password'})
    return;
  }

  const isValidPassword = await isPasswordValid(password, validUser?.password);
  if (!isValidPassword) {
    res.status(400).json({error: 'Invalid Username or Password'})
    return;
  }

  generateTokenAndSetCookie(validUser._id, res);

  res.status(200).json({
    _id: validUser._id,
    fullName: validUser.fullName,
    username: validUser.username,
    profilePic: validUser.profilePic
  })
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.cookie('jwt','', {maxAge: 0});
  res.status(200).json({message: 'Logged out successfully!'});
};