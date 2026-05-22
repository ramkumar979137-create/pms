// Service/RentalCancellation.service.ts
import { AppDataSource }          from "../config/data-source";
import { RentalCancellation }     from "../Entity/RentalCancellation";
import { CreateCancellationDTO, UpdateCancellationDTO } from "../DTO/RentalCancellation.dto";
import path  from "path";
import fs    from "fs";

const repo = AppDataSource.getRepository(RentalCancellation);

/* ── Upload dir ── */
const UPLOAD_DIR = path.join(__dirname, "../../uploads/cancellation");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ──────────────────────────────────────
   Save uploaded files to disk
────────────────────────────────────── */
export const saveFiles = (
  files: Express.Multer.File[]
): { name: string; url: string; type: string; uploadedAt: string }[] => {
  return files.map((file) => {
    const ext      = path.extname(file.originalname);
    const safeName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    const destPath = path.join(UPLOAD_DIR, safeName);

    fs.writeFileSync(destPath, file.buffer);

    return {
      name:       file.originalname,
      url:        `/uploads/cancellation/${safeName}`,
      type:       ext.replace(".", "").toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  });
};

/* ──────────────────────────────────────
   CREATE CANCELLATION
────────────────────────────────────── */
export const createCancellation = async (
  data: CreateCancellationDTO,
  files: Express.Multer.File[] = []
): Promise<RentalCancellation> => {

  const savedDocs = saveFiles(files);

  const cancellation = repo.create({
    ...data,
    docs: savedDocs,
  });

  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as RentalCancellation;
};

/* ──────────────────────────────────────
   GET ALL CANCELLATIONS (with filters)
────────────────────────────────────── */
export const getAllCancellations = async (filters: {
  status?:   string;
  reason?:   string;
  tenant?:   string;
  property?: string;
}): Promise<RentalCancellation[]> => {

  const qb = repo.createQueryBuilder("c");

  if (filters.status)   qb.andWhere("c.status   = :status",   { status:   filters.status   });
  if (filters.reason)   qb.andWhere("c.reason   = :reason",   { reason:   filters.reason   });
  if (filters.tenant)   qb.andWhere("c.tenant   LIKE :tenant", { tenant:  `%${filters.tenant}%`   });
  if (filters.property) qb.andWhere("c.property LIKE :prop",   { prop:    `%${filters.property}%` });

  return await qb.orderBy("c.createdAt", "DESC").getMany();
};

/* ──────────────────────────────────────
   GET BY ID
────────────────────────────────────── */
export const getCancellationById = async (id: number): Promise<RentalCancellation> => {
  const cancellation = await repo.findOne({ where: { id } });
  if (!cancellation) throw new Error("Cancellation request not found");
  return cancellation;
};

/* ──────────────────────────────────────
   UPDATE CANCELLATION (status, amounts, etc)
────────────────────────────────────── */
export const updateCancellation = async (
  id:    number,
  data:  UpdateCancellationDTO,
  files: Express.Multer.File[] = []
): Promise<RentalCancellation> => {

  const cancellation = await getCancellationById(id);

  const newDocs    = saveFiles(files);
  const mergedDocs = [...(cancellation.docs || []), ...newDocs];

  Object.assign(cancellation, { ...data, docs: mergedDocs });
  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as RentalCancellation;
};

/* ──────────────────────────────────────
   DELETE ONE DOC from cancellation
────────────────────────────────────── */
export const deleteDocument = async (
  id:       number,
  fileName: string
): Promise<RentalCancellation> => {

  const cancellation = await getCancellationById(id);

  // Remove file from disk
  const doc = cancellation.docs?.find(d => d.name === fileName);

  if (doc?.url) {
    const filePath = path.join(__dirname, "../../", doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  cancellation.docs = (cancellation.docs || []).filter(d => d.name !== fileName);
  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as RentalCancellation;
};

/* ──────────────────────────────────────
   DELETE CANCELLATION REQUEST
────────────────────────────────────── */
export const deleteCancellation = async (id: number): Promise<void> => {
  const cancellation = await getCancellationById(id);

  // Delete all attached files from disk
  (cancellation.docs || []).forEach(doc => {
    if (doc.url) {
      const filePath = path.join(__dirname, "../../", doc.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  await repo.delete(id);
};
