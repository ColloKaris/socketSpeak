import { Request, Response } from 'express';
import { ExpressError } from '../utils/ExpressError.js';
import { fetchOtherUsers } from '../services/user.service.js';

export const getUsersForSidebar = async (req: Request, res: Response) => {
  // Get currently authenticated users id
  if (!req.user || !req.user._id) {
    throw new ExpressError('User is not authenticated or lacks an ID.', 400);
  }
  const loggedInUserId = req.user._id;

  const filteredUsers = await fetchOtherUsers(loggedInUserId);
  if (!filteredUsers) {
    throw new ExpressError('Could not fetch other users', 500);
  }

  res.status(200).json(filteredUsers);
};
