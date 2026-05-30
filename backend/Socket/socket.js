import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import express from "express";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://real-time-chat-platform.onrender.com",
  "https://realtime-messaging-platform.onrender.com",
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to store online users
const userSocketmap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketmap[userId] = socket.id;
  }

  io.emit("getOnlineUser", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    delete userSocketmap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketmap));
  });
});

export { app, io, server };
