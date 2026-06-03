import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../Controller/Vendor.controller";

const router = Router();

// POST   /api/vendors          → create
router.post("/", create);
// GET    /api/vendors          → get all
router.get("/", getAll);
// GET    /api/vendors/:id      → get one
router.get("/:id", getOne);
// PUT    /api/vendors/:id      → update
router.put("/:id", update);
// DELETE /api/vendors/:id      → delete
router.delete("/:id", remove);

export default router;
