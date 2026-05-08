import Analytics from "../models/analytics.model.js";

export const createEvent = async (data) => {
  const event = new Analytics(data);
  return await event.save();
};

export const getClicksByShortCode = async (shortCode) => {
  return await Analytics.find({ shortCode }).sort({ createdAt: -1 });
};

export const getClicksByDateRange = async (shortCode, startDate, endDate) => {
  return await Analytics.find({
    shortCode,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ createdAt: -1 });
};

export const getClickCountByShortCode = async (shortCode) => {
  return await Analytics.countDocuments({ shortCode });
};

export const getDeviceBreakdown = async (shortCode) => {
  return await Analytics.aggregate([
    { $match: { shortCode } },
    { $group: { _id: "$device", count: { $sum: 1 } } },
  ]);
};

export const getBrowserBreakdown = async (shortCode) => {
  return await Analytics.aggregate([
    { $match: { shortCode } },
    { $group: { _id: "$browser", count: { $sum: 1 } } },
  ]);
};