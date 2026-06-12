import { Request, Response } from "express";
import { getDashboardData } from "../Service/Dashboard.service";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await getDashboardData();
    return res.json(data);
  } catch (err: any) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: err?.message || "Unable to load dashboard data" });
  }
};