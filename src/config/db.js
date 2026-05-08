import mongoose from "mongoose";
import env from "./env.js";
import logger from "../logging/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

export default connectDB;