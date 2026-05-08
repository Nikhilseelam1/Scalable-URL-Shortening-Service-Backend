import Url from "../models/url.model.js";

export const findByShortCode = async (shortCode) => {
  return await Url.findOne({ shortCode, isActive: true });
};

export const findByUserId = async (userId) => {
  return await Url.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

export const findByCustomAlias = async (customAlias) => {
  return await Url.findOne({ customAlias, isActive: true });
};

export const createUrl = async (data) => {
  const url = new Url(data);
  return await url.save();
};

export const incrementClickCount = async (shortCode) => {
  return await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { clickCount: 1 } },
    { new: true }
  );
};

export const deleteByShortCode = async (shortCode, userId) => {
  return await Url.findOneAndUpdate(
    { shortCode, userId },
    { isActive: false },
    { new: true }
  );
};