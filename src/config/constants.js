export const CACHE_TTL = {
  URL: 60 * 60 * 24,
  URL_NOT_FOUND: 60 * 5,
};

export const RATE_LIMIT = {
  API: {
    WINDOW_MS: 60 * 1000,
    MAX_REQUESTS: 60,
  },
  REDIRECT: {
    WINDOW_MS: 60 * 1000,
    MAX_REQUESTS: 120,
  },
};

export const QUEUE_NAMES = {
  ANALYTICS: "analytics",
};

export const SHORT_CODE_LENGTH = 7;

export const BCRYPT_SALT_ROUNDS = 10;

export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
};