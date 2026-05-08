import redis from "../config/redis.js";
import { RATE_LIMIT } from "../config/constants.js";
import { sendError } from "../utils/apiResponse.js";

const redirectLimiter = async (req, res, next) => {
  const key = `ratelimit:redirect:${req.ip}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.REDIRECT.WINDOW_MS;

  try {
    await redis.zremrangebyscore(key, 0, windowStart);
    const requestCount = await redis.zcard(key);

    if (requestCount >= RATE_LIMIT.REDIRECT.MAX_REQUESTS) {
      return sendError(res, 429, "Too many redirect requests. Please slow down.");
    }

    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.pexpire(key, RATE_LIMIT.REDIRECT.WINDOW_MS);

    next();
  } catch (error) {
    next(error);
  }
};

export default redirectLimiter;