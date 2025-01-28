import express from 'express';

import { wrapAsync } from '../utils/asyncErrorHandler.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { getUsersForSidebar } from '../controllers/user.controller.js';

export const userRouter = express.Router({mergeParams: true});

userRouter.get('/', wrapAsync(protectRoute), wrapAsync(getUsersForSidebar));