import * as analyticsService from "../services/analytics.service.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const analytics = await analyticsService.getAnalytics(shortCode);
    return sendSuccess(res, 200, "Analytics fetched successfully", analytics);
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsByDateRange = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const error = new Error("startDate and endDate are required");
      error.statusCode = 400;
      throw error;
    }

    const analytics = await analyticsService.getAnalyticsByDateRange(
      shortCode,
      new Date(startDate),
      new Date(endDate)
    );

    return sendSuccess(res, 200, "Analytics fetched successfully", analytics);
  } catch (error) {
    next(error);
  }
};