// Routes/RentalCancellation.routes.ts
import { Router }  from "express";
import multer      from "multer";
import {
  create,
  getAll,
  getOne,
  update,
  removeDoc,
  remove,
} from "../Controller/RentalCancellation.controller";

const router = Router();

/* ── Multer — memory storage (buffer passed to service) ── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },          // 10 MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, PNG, DOC, DOCX files are allowed"));
    }
  },
});

/* ─────────────────────────────────
   Routes
   Base: /api/rental-cancellations
───────────────────────────────── */

// POST   /api/rental-cancellations          → create (with file upload)
router.post(   "/",          upload.array("docs", 10), create);

// GET    /api/rental-cancellations          → get all (?status=Pending&tenant=name)
router.get(    "/",          getAll);

// GET    /api/rental-cancellations/:id      → get one
router.get(    "/:id",       getOne);

// PUT    /api/rental-cancellations/:id      → update (with optional new files)
router.put(    "/:id",       upload.array("docs", 10), update);

// DELETE /api/rental-cancellations/:id/doc → remove one document
router.delete( "/:id/doc",   removeDoc);

// DELETE /api/rental-cancellations/:id     → delete cancellation request
router.delete( "/:id",       remove);

export default router;
