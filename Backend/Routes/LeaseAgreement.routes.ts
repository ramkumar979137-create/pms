// Routes/LeaseAgreement.routes.ts
import { Router }  from "express";
import multer      from "multer";
import {
  create,
  getAll,
  getOne,
  update,
  removeDoc,
  remove,
} from "../Controller/LeaseAgreement.controller";

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
   Base: /api/lease-agreements
───────────────────────────────── */

// POST   /api/lease-agreements          → create (with file upload)
router.post(   "/",          upload.array("docs", 10), create);

// GET    /api/lease-agreements          → get all (?status=Active&tenant=name)
router.get(    "/",          getAll);

// GET    /api/lease-agreements/:id      → get one
router.get(    "/:id",       getOne);

// PUT    /api/lease-agreements/:id      → update (with optional new files)
router.put(    "/:id",       upload.array("docs", 10), update);

// DELETE /api/lease-agreements/:id/doc → remove one document
router.delete( "/:id/doc",   removeDoc);

// DELETE /api/lease-agreements/:id     → delete lease
router.delete( "/:id",       remove);

export default router;
