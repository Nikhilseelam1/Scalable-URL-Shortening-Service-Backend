import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import redis from "./src/config/redis.js";
import logger from "./src/logging/logger.js";
import env from "./src/config/env.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`API server running on port ${env.PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutting down server...");
    server.close(async () => {
      await redis.quit();
      logger.info("Server shut down gracefully");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer();