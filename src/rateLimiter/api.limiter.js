import redis from "../config/redis.js";
import { RATE_LIMIT } from "../config/constants.js";
import { sendError } from "../utils/apiResponse.js";

const apiLimiter = async (req, res, next) => {
  const identifier = req.user?.id || req.ip;
  const key = `ratelimit:api:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.API.WINDOW_MS;

  try {
    await redis.zremrangebyscore(key, 0, windowStart);
    const requestCount = await redis.zcard(key);

    if (requestCount >= RATE_LIMIT.API.MAX_REQUESTS) {
      return sendError(res, 429, "Too many requests. Please try again later.");
    }

    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.pexpire(key, RATE_LIMIT.API.WINDOW_MS);

    next();
  } catch (error) {
    next(error);
  }
};

export default apiLimiter;