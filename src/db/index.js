import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionResponse = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      ` \n MongoDb connected and DB HOST is ${connectionResponse.connection.host}`
    );
  } catch (error) {
    console.log("Error ", error);
    process.exit(1);
  }
};
export default connectDB