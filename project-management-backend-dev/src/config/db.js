import mongoose from 'mongoose';
import { config } from './config.js';

//mongodb connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      dbName: 'PM-review',
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
