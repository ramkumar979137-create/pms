// Routes/RentalAgreement.routes.ts
import { Router }  from "express";
import multer      from "multer";
import {
  create,
  getAll,
  getOne,
  update,
  removeDoc,
  remove,
} from "../Controller/Rentalagreement.controller";

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
   Base: /api/rental-agreements
───────────────────────────────── */

// POST   /api/rental-agreements          → create (with file upload)
router.post(   "/",          upload.array("docs", 10), create);

// GET    /api/rental-agreements          → get all (?status=Active&tenant=Priya)
router.get(    "/",          getAll);

// GET    /api/rental-agreements/:id      → get one
router.get(    "/:id",       getOne);

// PUT    /api/rental-agreements/:id      → update (with optional new files)
router.put(    "/:id",       upload.array("docs", 10), update);

// DELETE /api/rental-agreements/:id/doc → remove one document
router.delete( "/:id/doc",   removeDoc);

// DELETE /api/rental-agreements/:id     → delete rental
router.delete( "/:id",       remove);

export default router;