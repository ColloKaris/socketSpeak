import express from 'express';

import { signup, login, logout } from '../controllers/auth.controller.js';
import { wrapAsync } from '../utils/asyncErrorHandler.js';

export const authRoutes = express.Router({mergeParams: true});

authRoutes.post('/signup', wrapAsync(signup));

authRoutes.post('/login', login);

authRoutes.post('/logout', logout);