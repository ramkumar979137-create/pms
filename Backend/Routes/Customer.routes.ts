import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../Controller/Customer.controller";

const router = Router();

// POST   /api/customers          → create
router.post("/", create);
// GET    /api/customers          → get all
router.get("/", getAll);
// GET    /api/customers/:id      → get one
router.get("/:id", getOne);
// PUT    /api/customers/:id      → update
router.put("/:id", update);
// DELETE /api/customers/:id      → delete
router.delete("/:id", remove);

export default router;
