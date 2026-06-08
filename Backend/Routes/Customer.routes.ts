import { Router } from "express";
import multer from "multer";
import { create, getAll, getOne, update, remove } from "../Controller/Customer.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST   /api/customers          → create
router.post("/", upload.array("docs", 10), create);
// GET    /api/customers          → get all
router.get("/", getAll);
// GET    /api/customers/:id      → get one
router.get("/:id", getOne);
// PUT    /api/customers/:id      → update
router.put("/:id", upload.array("docs", 10), update);
// DELETE /api/customers/:id      → delete
router.delete("/:id", remove);

export default router;
