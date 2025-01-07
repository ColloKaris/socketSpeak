import express, { Request, Response, NextFunction } from 'express';
import config from 'config';

import { logger } from './utils/logger.js';
import { authRoutes } from './routes/auth.routes.js';
import { ExpressError } from './utils/ExpressError.js';
import { connectToDatabase } from './utils/db/connectToDb.js';

const app = express();
const port = config.get<number>('server.port') || 3000;
const dbUri = config.get<string>('database.dbUri');

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ExpressError ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';

  logger.error(`[ERROR] ${statusCode} - ${message}`);

  // check accept headers sent by the client to determine preferred media type in response
  if (req.accepts('html')) {
    res.status(statusCode).send(`${statusCode} - ${message}`)
  } else {
    res.status(statusCode).json({error: message, statusCode})
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
