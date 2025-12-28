import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { chats } from "./data/data.js";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./rout/authUser.js";
import messageRouter from "./rout/messageRout.js";
import userRouter from "./rout/userRout.js";

import { app, server } from "./Socket/socket.js";

dotenv.config();
const __dirname = path.resolve();

// ✅ FIXED CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-platform.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ IMPORTANT for preflight
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// DB
dbConnect();

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Chat test route
app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  if (!singleChat) {
    return res.status(404).send({ message: "Chat not found" });
  }
  res.send(singleChat);
});

// Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
