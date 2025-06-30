import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const connectDB = async () => {
  try {     
    let connectionInstance = await mongoose.connect(process.env.MONGO_DB_URL)
    return connectionInstance.connection.host
  } catch (error) {
    throw error
  }
}
