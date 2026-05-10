import Redis from "ioredis";
import env from "./env.js";
import logger from "../logging/logger.js";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  tls: {},
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (error) => {
  logger.error(`Redis error: ${error.message}`);
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

export default redis;