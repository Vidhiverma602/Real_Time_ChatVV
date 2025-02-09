// import mongoose from "mongoose";

// const dbConnect= async()=> {
//     try{
//         await mongoose.connect(process.env.MONGODB_CONNECT),
//         console.log("DB connected succesfully");


//     }catch(error){
//        console.log(console.error); 
//     }
// }
// const mongoose = require("mongoose");




// const mongoose = require("mongoose");

// const dbConnect = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_CONNECT); // No options needed
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1); // Exit the process with failure
//   }
// };

// module.exports = dbConnect;




import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT); // No options needed
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnect;
