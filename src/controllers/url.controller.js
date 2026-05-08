import * as urlService from "../services/url.service.js";
import * as analyticsService from "../services/analytics.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import env from "../config/env.js";

export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user?.id || null;

    const url = await urlService.shortenUrl(originalUrl, userId, customAlias, expiresAt);

    return sendSuccess(res, 201, "URL shortened successfully", {
      shortUrl: `${env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt,
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await urlService.resolveUrl(shortCode);

    await analyticsService.recordClick(
      shortCode,
      req.ip,
      req.headers["user-agent"] || "",
      req.headers["referer"] || null
    );

    return res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getUserUrls = async (req, res, next) => {
  try {
    const urls = await urlService.getUserUrls(req.user.id);
    return sendSuccess(res, 200, "URLs fetched successfully", urls);
  } catch (error) {
    next(error);
  }
};

export const deleteUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    await urlService.deleteUrl(shortCode, req.user.id);
    return sendSuccess(res, 200, "URL deleted successfully");
  } catch (error) {
    next(error);
  }
};