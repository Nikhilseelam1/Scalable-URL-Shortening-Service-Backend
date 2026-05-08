import Joi from "joi";

export const shortenUrlSchema = Joi.object({
  originalUrl: Joi.string().uri().required(),
  customAlias: Joi.string().alphanum().min(3).max(20).optional(),
  expiresAt: Joi.date().greater("now").optional(),
});

export const deleteUrlSchema = Joi.object({
  shortCode: Joi.string().required(),
});