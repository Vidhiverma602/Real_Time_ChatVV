import express from "express";
import dotenv from "dotenv";
import { chats } from "./data/data.js"; // Use .js extension for local files
import dbConnect from "./DB/dbConnect.js"; // Use .js extension for local files
import authRouter from "./rout/authUser.js";
import messageRouter from "./rout/messageRout.js";
import userRouter from "./rout/userRout.js";
import cookieParser from "cookie-parser";
import path from 'path';
import cors from "cors";

//import userRouter from './rout/userRout.js'

import { app, server } from "./Socket/socket.js"; 
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true, // ✅ Allow cookies & authentication
  })
);

// const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
//middleware
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// Connect to the database
dbConnect();

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running");
});

// Get all chats
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// Get chat by ID
app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  if (!singleChat) {
    return res.status(404).send({ message: "Chat not found" });
  }
  res.send(singleChat);
});

// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});





















































// const express = require("express");
// const dotenv = require("dotenv");
// const {chats} = require("./data/data");
// const dbConnect = require("./DB/dbConnect");

// const app = express();
// dotenv.config();
// app.get("/",(req,res) => {
//     res.send("API is running");
// });

// app.get("/api/chat" , (req , res)=>{
//     res.send(chats);
// });

// app.get("/api/chat/:id" , (req , res)=>{
//     // console.log(req.params.id);
//     const singleChat = chats.find((c) => c._id === req.params.id);
//     res.send(singleChat);
// });

// const PORT = process.env.PORT || 7000

// app.listen(PORT,()=>{
//     dbConnect();
//     console.log(`Server started at port ${PORT}`);
// })

// //app.listen(7000, console.log(`Server started at port ${PORT}`));

// const express = require("express");
// const dotenv = require("dotenv");
// const { chats } = require("./data/data");
// const dbConnect = require("./DB/dbConnect");

// const app = express();
// dotenv.config();

// dbConnect();

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   if (!singleChat) {
//     return res.status(404).send({ message: "Chat not found" });
//   }
//   res.send(singleChat);
// });

// const PORT = process.env.PORT || 7000;

// app.listen(PORT, () => {
//   console.log(`Server started at port ${PORT}`);
// });