
import  dotenv  from "dotenv"

import connectDB from "./db/index.js";
import express from "express"
const app = express();


dotenv.config({
    path:'./env'
})
connectDB();


















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