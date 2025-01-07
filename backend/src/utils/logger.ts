import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pino = require('pino');

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
  },
});

export const logger = pino(transport);