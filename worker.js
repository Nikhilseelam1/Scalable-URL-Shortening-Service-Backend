import "dotenv/config";
import connectDB from "./src/config/db.js";
import logger from "./src/logging/logger.js";
import redis from "./src/config/redis.js";
import analyticsWorker from "./src/workers/analytics.worker.js";

const startWorker = async () => {
  await connectDB();

  logger.info("Analytics worker started");

  const shutdown = async () => {
    logger.info("Shutting down worker...");
    await analyticsWorker.close();
    await redis.quit();
    logger.info("Worker shut down gracefully");
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startWorker();