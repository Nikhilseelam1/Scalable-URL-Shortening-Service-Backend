import { Router } from "express";
import * as urlController from "../controllers/url.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import redirectLimiter from "../rateLimiter/redirect.limiter.js";
import apiLimiter from "../rateLimiter/api.limiter.js";
import { shortenUrlSchema } from "../validators/url.validator.js";

const router = Router();

router.post("/shorten", authMiddleware, apiLimiter, validate(shortenUrlSchema), urlController.shortenUrl);
router.get("/my-urls", authMiddleware, urlController.getUserUrls);
router.delete("/:shortCode", authMiddleware, urlController.deleteUrl);
router.get("/:shortCode", redirectLimiter, urlController.redirectUrl);

export default router;