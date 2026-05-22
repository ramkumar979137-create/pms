// Routes/LeaseCancellation.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  create,
  getAll,
  getOne,
  update,
  deleteDocument,
  remove,
} from "../Controller/LeaseCancellation.controller";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

/* ─────────────────────────────────
   Routes
   Base: /api/lease-cancellations
───────────────────────────────── */

// POST   /api/lease-cancellations          → create (with file upload)
router.post("/", upload.array("docs", 10), create);

// GET    /api/lease-cancellations          → get all (?status=Pending&tenant=name&property=name)
router.get("/", getAll);

// GET    /api/lease-cancellations/:id      → get one
router.get("/:id", getOne);

// PUT    /api/lease-cancellations/:id      → update (with optional new files)
router.put("/:id", upload.array("docs", 10), update);

// DELETE /api/lease-cancellations/:id/doc/:filename → remove one document
router.delete("/:id/doc/:filename", deleteDocument);

// DELETE /api/lease-cancellations/:id     → delete cancellation request
router.delete("/:id", remove);

export default router;
