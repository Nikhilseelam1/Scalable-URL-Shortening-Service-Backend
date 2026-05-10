import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlRoutes from "./url.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/urls", urlRoutes);
router.use("/analytics", analyticsRoutes);

export default router;