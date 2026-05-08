import * as analyticsRepository from "../repositories/analytics.repository.js";
import { addAnalyticsJob } from "../queues/analytics.queue.js";
import hashIp from "../utils/hashIp.js";
import parseUserAgent from "../utils/parseUserAgent.js";

export const recordClick = async (shortCode, ip, userAgent, referrer) => {
  const jobData = {
    shortCode,
    ipHash: hashIp(ip),
    referrer: referrer || null,
    ...parseUserAgent(userAgent),
  };

  await addAnalyticsJob(jobData);
};

export const getAnalytics = async (shortCode) => {
  const [totalClicks, deviceBreakdown, browserBreakdown] = await Promise.all([
    analyticsRepository.getClickCountByShortCode(shortCode),
    analyticsRepository.getDeviceBreakdown(shortCode),
    analyticsRepository.getBrowserBreakdown(shortCode),
  ]);

  return {
    shortCode,
    totalClicks,
    deviceBreakdown,
    browserBreakdown,
  };
};

export const getAnalyticsByDateRange = async (shortCode, startDate, endDate) => {
  return await analyticsRepository.getClicksByDateRange(shortCode, startDate, endDate);
};