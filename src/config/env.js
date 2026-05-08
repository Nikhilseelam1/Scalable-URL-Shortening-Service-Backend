import { cleanEnv, str, port, num } from "envalid";

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  MONGO_URI: str(),
  REDIS_HOST: str({ default: "localhost" }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_EXPIRES_IN: str({ default: "15m" }),
  JWT_REFRESH_EXPIRES_IN: str({ default: "7d" }),
  BASE_URL: str(),
  NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
});

export default env;