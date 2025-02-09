// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   gender: {
//     type: String,
//     required: true,
//     enum: ["male", "female"],
//   },
//   passward: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   profilepic: {
//     type: String,
//     required: true,
//     default:""
//   },
// },{timestamp:true});

// const user = mongoose.model("user" , userSchema);
// export default User;

import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    password: {
      // Corrected spelling from 'passward' to 'password'
      type: String,
      required: true,
      minlength: 6,
    },
    profilepic: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true } // Corrected to 'timestamps' instead of 'timestamp'
);

// Create the model
const User = mongoose.model("User", userSchema);

// Export the model
export default User;
