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

// Define a mapping of userId (string) to socketId (string)
const userSocketMap: Record<string, string> = {};

// Function to get the socket ID of a receiver
export const getReceiverSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {

  // Get userId from socket handshake query
  const userId = socket.handshake.query.userId as string | undefined;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});