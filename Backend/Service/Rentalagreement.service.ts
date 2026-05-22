// Service/RentalAgreement.Service.ts
import { AppDataSource }    from "../config/data-source";
import { RentalAgreement }  from "../Entity/Rentalagreement";
import { CreateRentalDTO, UpdateRentalDTO } from "../DTO/Rental.dto";
import path  from "path";
import fs    from "fs";

const repo = AppDataSource.getRepository(RentalAgreement);

/* ── Upload dir ── */
const UPLOAD_DIR = path.join(__dirname, "../../uploads/rental");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/* ──────────────────────────────────────
   Save uploaded files to disk
   Returns array of { name, url, type }
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
      url:        `/uploads/rental/${safeName}`,   // served as static
      type:       ext.replace(".", "").toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  });
};

/* ──────────────────────────────────────
   CREATE
────────────────────────────────────── */
export const createRental = async (
  data: CreateRentalDTO,
  files: Express.Multer.File[] = []
): Promise<RentalAgreement> => {

  const savedDocs = saveFiles(files);

  const rental = repo.create({
    ...data,
    docs: savedDocs,
  });

  const result = await repo.save(rental);
  return (Array.isArray(result) ? result[0] : result) as RentalAgreement;
};

/* ──────────────────────────────────────
   GET ALL  (with optional filters)
────────────────────────────────────── */
export const getAllRentals = async (filters: {
  status?:   string;
  tenant?:   string;
  property?: string;
}): Promise<RentalAgreement[]> => {

  const qb = repo.createQueryBuilder("r");

  if (filters.status)   qb.andWhere("r.status   = :status",   { status:   filters.status   });
  if (filters.tenant)   qb.andWhere("r.tenant   LIKE :tenant", { tenant:  `%${filters.tenant}%`   });
  if (filters.property) qb.andWhere("r.property LIKE :prop",   { prop:    `%${filters.property}%` });

  return await qb.orderBy("r.createdAt", "DESC").getMany();
};

/* ──────────────────────────────────────
   GET BY ID
────────────────────────────────────── */
export const getRentalById = async (id: number): Promise<RentalAgreement> => {
  const rental = await repo.findOne({ where: { id } });
  if (!rental) throw new Error("Rental agreement not found");
  return rental;
};

/* ──────────────────────────────────────
   UPDATE  (also append new files)
────────────────────────────────────── */
export const updateRental = async (
  id:    number,
  data:  UpdateRentalDTO,
  files: Express.Multer.File[] = []
): Promise<RentalAgreement> => {

  const rental = await getRentalById(id);

  const newDocs    = saveFiles(files);
  const mergedDocs = [...(rental.docs || []), ...newDocs];

  Object.assign(rental, { ...data, docs: mergedDocs });
  return await repo.save(rental);
};

/* ──────────────────────────────────────
   DELETE ONE DOC from a rental
────────────────────────────────────── */
export const deleteDocument = async (
  id:       number,
  fileName: string
): Promise<RentalAgreement> => {

  const rental = await getRentalById(id);

  // Remove file from disk
  const doc = rental.docs?.find(d => d.name === fileName);

  if (doc?.url) {
    const filePath = path.join(__dirname, "../../", doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  rental.docs = (rental.docs || []).filter(d => d.name !== fileName);
  return await repo.save(rental);
};

/* ──────────────────────────────────────
   DELETE RENTAL
────────────────────────────────────── */
export const deleteRental = async (id: number): Promise<void> => {
  const rental = await getRentalById(id);

  // Delete all attached files from disk
  (rental.docs || []).forEach(doc => {
    if (doc.url) {
      const filePath = path.join(__dirname, "../../", doc.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  await repo.delete(id);
};