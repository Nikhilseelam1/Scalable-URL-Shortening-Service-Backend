import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import apiLimiter from "../rateLimiter/api.limiter.js";

const router = Router();

router.get("/:shortCode", authMiddleware, apiLimiter, analyticsController.getAnalytics);
router.get("/:shortCode/range", authMiddleware, apiLimiter, analyticsController.getAnalyticsByDateRange);

export default router;