import express from 'express';
import config from 'config';
import * as mongodb from 'mongodb';
import { Server } from 'socket.io';

import { logger } from '../utils/logger.js';

export const app = express();
const port = config.get<number>('server.port') || 3000;

export const expressServer = app.listen(port, () => {
  logger.info(`App runnning at http://localhost:${port}`);
});

export const io = new Server(expressServer, {
  cors: {
    origin: ['http://127.0.0.1:3001','http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET','POST']
  },
});

export const getReceiverSocketId = (userId: mongodb.ObjectId) => {
  return userSocketMap.userId;
}

// used to get users that are online
const userSocketMap: {userId?: string} = {}; // {userId: socketId}

io.on('connection', (socket) => {
  //logger.info(`A user connected. Id: ${socket.id.substring(0,5)}`);

  const userId = socket.handshake.query.userId;
  if(userId) {
    userSocketMap.userId = socket.id;
  };

  // send event to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    //logger.info(`User disconnected. Id: ${socket.id.substring(0,5)}`);
    delete userSocketMap.userId;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  })
})