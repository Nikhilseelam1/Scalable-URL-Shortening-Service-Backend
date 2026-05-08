import { sendError } from "../utils/apiResponse.js";

const notFoundMiddleware = (req, res) => {
  return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
};

export default notFoundMiddleware;