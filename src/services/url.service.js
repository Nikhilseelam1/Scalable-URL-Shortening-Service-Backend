import * as urlRepository from "../repositories/url.repository.js";
import * as urlCache from "../cache/url.cache.js";
import { generateShortCode } from "../utils/base62.js";
import { SHORT_CODE_LENGTH } from "../config/constants.js";

export const shortenUrl = async (originalUrl, userId, customAlias, expiresAt) => {
  if (customAlias) {
    const existing = await urlRepository.findByCustomAlias(customAlias);
    if (existing) {
      const error = new Error("Custom alias already in use");
      error.statusCode = 409;
      throw error;
    }
  }

  let shortCode = customAlias || generateShortCode(SHORT_CODE_LENGTH);

  if (!customAlias) {
    let attempts = 0;
    while (await urlRepository.findByShortCode(shortCode)) {
      shortCode = generateShortCode(SHORT_CODE_LENGTH);
      attempts++;
      if (attempts > 5) {
        const error = new Error("Failed to generate unique short code");
        error.statusCode = 500;
        throw error;
      }
    }
  }

  const urlData = {
    originalUrl,
    shortCode,
    customAlias: customAlias || null,
    userId: userId || null,
    expiresAt: expiresAt || null,
  };

  const url = await urlRepository.createUrl(urlData);

  const ttl = expiresAt
    ? Math.floor((new Date(expiresAt) - Date.now()) / 1000)
    : undefined;

  await urlCache.setUrl(shortCode, url, ttl);

  return url;
};

export const resolveUrl = async (shortCode) => {
  const cached = await urlCache.getUrl(shortCode);

  if (cached !== null) {
    if (!cached) {
      const error = new Error("URL not found");
      error.statusCode = 404;
      throw error;
    }
    return cached;
  }

  const url = await urlRepository.findByShortCode(shortCode);

  if (!url) {
    await urlCache.setNotFound(shortCode);
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    await urlCache.setNotFound(shortCode);
    const error = new Error("URL has expired");
    error.statusCode = 410;
    throw error;
  }

  const ttl = url.expiresAt
    ? Math.floor((new Date(url.expiresAt) - Date.now()) / 1000)
    : undefined;

  await urlCache.setUrl(shortCode, url, ttl);

  return url;
};

export const getUserUrls = async (userId) => {
  return await urlRepository.findByUserId(userId);
};

export const deleteUrl = async (shortCode, userId) => {
  const url = await urlRepository.deleteByShortCode(shortCode, userId);
  if (!url) {
    const error = new Error("URL not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }
  await urlCache.deleteUrl(shortCode);
  return url;
};