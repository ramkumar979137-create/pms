import { Router } from "express";
import { create, getAll, getOne, update, remove } from "../Controller/Property.controller";

const router = Router();

// POST   /api/properties          → create
router.post("/", create);
// GET    /api/properties          → get all
router.get("/", getAll);
// GET    /api/properties/:id      → get one
router.get("/:id", getOne);
// PUT    /api/properties/:id      → update
router.put("/:id", update);
// DELETE /api/properties/:id      → delete
router.delete("/:id", remove);

export default router;