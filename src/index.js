import dotenv from "dotenv";

import connectDB from "./db/index.js";
import express from "express";
const app = express();

dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on the port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("connection to the database is Successfull ", error);
  });

/*


import mongoose from "mongoose";
import { DB_NAME } from "./constants";



// this is the immdiiatly invoked function ifie
(async()=>{
    try {
        await  mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
  app.on("error",(error)=>{
    console.log("Error: ", error );
    throw err
  })

app.listen(process.env.PORT,()=>{ 
    console.log(`App is running on the port ${process.env.}`);
    
})

} catch (error) {
    
    console.log("error is " ,error);
    
}


})()

*/
