import { sendError } from "../utils/apiResponse.js";
import logger from "../logging/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal Server Error";

  return sendError(res, statusCode, message, err.errors || null);
};

export default errorMiddleware;