import redis from "../config/redis.js";
import { CACHE_TTL } from "../config/constants.js";

const getKey = (shortCode) => `url:${shortCode}`;

export const getUrl = async (shortCode) => {
  const data = await redis.get(getKey(shortCode));
  return data ? JSON.parse(data) : null;
};

export const setUrl = async (shortCode, urlData, ttl = CACHE_TTL.URL) => {
  await redis.set(getKey(shortCode), JSON.stringify(urlData), "EX", ttl);
};

export const deleteUrl = async (shortCode) => {
  await redis.del(getKey(shortCode));
};

export const setNotFound = async (shortCode) => {
  await redis.set(getKey(shortCode), JSON.stringify(null), "EX", CACHE_TTL.URL_NOT_FOUND);
};