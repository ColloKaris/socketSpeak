import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';
import { wrapAsync } from '../utils/asyncErrorHandler.js';
import { validate } from '../middleware/validateResource.js';
import { usersZodSchema } from '../schema/user.schema.js';
import { authZodSchema } from '../schema/auth.schema.js';

export const authRouter = express.Router({mergeParams: true});

authRouter.post('/signup', validate(usersZodSchema), wrapAsync(signup));

authRouter.post('/login', validate(authZodSchema), wrapAsync(login));

authRouter.post('/logout', logout);