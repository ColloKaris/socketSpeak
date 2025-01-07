import express from 'express';
import config from 'config';

import { logger } from './utils/logger.js';

const app = express();
const port = config.get<number>('server.port') || 3000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
