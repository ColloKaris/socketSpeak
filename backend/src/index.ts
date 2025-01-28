import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import cookieParser from 'cookie-parser';

import { connectToDatabase } from './utils/db/connectToDb.js';
import { logger } from './utils/logger.js';

import { authRouter } from './routes/auth.routes.js';
import { ExpressError } from './utils/ExpressError.js';
import { messageRouter } from './routes/message.routes.js';
import { userRouter } from './routes/user.routes.js';

const app = express();
const port = config.get<number>('server.port') || 3000;
const dbUri = config.get<string>('database.dbUri');

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ExpressError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  // logger.error(`[ERROR] ${statusCode} - ${message}`);

  // check accept headers sent by the client to determine preferred media type in response
  if (req.accepts('html')) {
    res.status(statusCode).send(`${statusCode} - ${message}`)
  } else {
    res.status(statusCode).json({error: message, details: err.details || []})
  }
})

try {
  await connectToDatabase(dbUri);
  logger.info('DATABASE CONNECTED!');

  app.listen(port, () => {
    logger.info(`App runnning at http://localhost:${port}`);
  });
} catch (error) {
  logger.error('FAILED TO CONNECT TO DATABASE');
  process.exit(1);
}
