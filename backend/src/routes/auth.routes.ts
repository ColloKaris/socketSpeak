import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';
import { wrapAsync } from '../utils/asyncErrorHandler.js';
import { validate } from '../middleware/validateResource.js';
import { usersZodSchema } from '../schema/user.schema.js';
import { authZodSchema } from '../schema/auth.schema.js';

export const authRoutes = express.Router({mergeParams: true});

authRoutes.post('/signup', validate(usersZodSchema), wrapAsync(signup));

authRoutes.post('/login', validate(authZodSchema), wrapAsync(login));

authRoutes.post('/logout', logout);