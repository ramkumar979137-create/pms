import { Router } from "express";
import { getDashboard } from "../Controller/Dashboard.controller";

const router = Router();

// GET /api/dashboard → get dashboard data
router.get("/", getDashboard);

export default router;