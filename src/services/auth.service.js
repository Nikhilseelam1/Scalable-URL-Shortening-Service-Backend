import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository.js";
import env from "../config/env.js";
import { BCRYPT_SALT_ROUNDS } from "../config/constants.js";

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const register = async (email, password) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await userRepository.createUser({ email, passwordHash });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await userRepository.addRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken, user: { id: user._id, email: user.email } };
};

export const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await userRepository.addRefreshToken(user._id, refreshToken);

  return { accessToken, refreshToken, user: { id: user._id, email: user.email } };
};

export const refreshAccessToken = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  const user = await userRepository.findById(payload.userId);
  if (!user || !user.refreshTokens.includes(token)) {
    const error = new Error("Refresh token revoked");
    error.statusCode = 401;
    throw error;
  }

  await userRepository.removeRefreshToken(user._id, token);

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  await userRepository.addRefreshToken(user._id, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId, token) => {
  await userRepository.removeRefreshToken(userId, token);
};