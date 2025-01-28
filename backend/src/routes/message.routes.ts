import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import { wrapAsync } from '../utils/asyncErrorHandler.js';
import { protectRoute } from '../middleware/protectRoute.js';

export const messageRouter = express.Router({mergeParams: true});

messageRouter.get('/:id', wrapAsync(protectRoute), wrapAsync(getMessages));

messageRouter.post('/send/:id', wrapAsync(protectRoute), wrapAsync(sendMessage));