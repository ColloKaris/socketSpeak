import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import { wrapAsync } from '../utils/asyncErrorHandler.js';
import { protectRoute } from '../middleware/protectRoute.js';

export const messageRouter = express.Router({mergeParams: true});

// include validation
messageRouter.post('/send/:id', wrapAsync(protectRoute), wrapAsync(sendMessage));