import User from "../models/user.model.js";

export const findByEmail = async (email) => {
  return await User.findOne({ email, isActive: true });
};

export const findById = async (id) => {
  return await User.findById(id);
};

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

export const addRefreshToken = async (userId, token) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { refreshTokens: token } },
    { new: true }
  );
};

export const removeRefreshToken = async (userId, token) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { refreshTokens: token } },
    { new: true }
  );
};

export const removeAllRefreshTokens = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { refreshTokens: [] } },
    { new: true }
  );
};