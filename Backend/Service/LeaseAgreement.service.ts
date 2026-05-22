// Service/LeaseAgreement.service.ts
import { AppDataSource }          from "../config/data-source";
import { LeaseAgreement }         from "../Entity/LeaseAgreement";
import { CreateLeaseDTO, UpdateLeaseDTO } from "../DTO/LeaseAgreement.dto";
import path  from "path";
import fs    from "fs";

const repo = AppDataSource.getRepository(LeaseAgreement);

/* ── Upload dir ── */
const UPLOAD_DIR = path.join(__dirname, "../../uploads/lease");
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
      url:        `/uploads/lease/${safeName}`,
      type:       ext.replace(".", "").toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  });
};

/* ──────────────────────────────────────
   CREATE LEASE
────────────────────────────────────── */
export const createLease = async (
  data: CreateLeaseDTO,
  files: Express.Multer.File[] = []
): Promise<LeaseAgreement> => {

  const savedDocs = saveFiles(files);

  const lease = repo.create({
    ...data,
    docs: savedDocs,
  });

  const result = await repo.save(lease);
  return (Array.isArray(result) ? result[0] : result) as LeaseAgreement;
};

/* ──────────────────────────────────────
   GET ALL LEASES (with filters)
────────────────────────────────────── */
export const getAllLeases = async (filters: {
  status?:   string;
  tenant?:   string;
  landlord?: string;
  property?: string;
}): Promise<LeaseAgreement[]> => {

  const qb = repo.createQueryBuilder("l");

  if (filters.status)   qb.andWhere("l.status   = :status",   { status:   filters.status   });
  if (filters.tenant)   qb.andWhere("l.tenant   LIKE :tenant", { tenant:  `%${filters.tenant}%`   });
  if (filters.landlord) qb.andWhere("l.landlord LIKE :landlord", { landlord:  `%${filters.landlord}%` });
  if (filters.property) qb.andWhere("l.property LIKE :prop",   { prop:    `%${filters.property}%` });

  return await qb.orderBy("l.createdAt", "DESC").getMany();
};

/* ──────────────────────────────────────
   GET BY ID
────────────────────────────────────── */
export const getLeaseById = async (id: number): Promise<LeaseAgreement> => {
  const lease = await repo.findOne({ where: { id } });
  if (!lease) throw new Error("Lease agreement not found");
  return lease;
};

/* ──────────────────────────────────────
   UPDATE LEASE
────────────────────────────────────── */
export const updateLease = async (
  id:    number,
  data:  UpdateLeaseDTO,
  files: Express.Multer.File[] = []
): Promise<LeaseAgreement> => {

  const lease = await getLeaseById(id);

  const newDocs    = saveFiles(files);
  const mergedDocs = [...(lease.docs || []), ...newDocs];

  Object.assign(lease, { ...data, docs: mergedDocs });
  const result = await repo.save(lease);
  return (Array.isArray(result) ? result[0] : result) as LeaseAgreement;
};

/* ──────────────────────────────────────
   DELETE ONE DOC from lease
────────────────────────────────────── */
export const deleteDocument = async (
  id:       number,
  fileName: string
): Promise<LeaseAgreement> => {

  const lease = await getLeaseById(id);

  // Remove file from disk
  const doc = lease.docs?.find(d => d.name === fileName);

  if (doc?.url) {
    const filePath = path.join(__dirname, "../../", doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  lease.docs = (lease.docs || []).filter(d => d.name !== fileName);
  const result = await repo.save(lease);
  return (Array.isArray(result) ? result[0] : result) as LeaseAgreement;
};

/* ──────────────────────────────────────
   DELETE LEASE
────────────────────────────────────── */
export const deleteLease = async (id: number): Promise<void> => {
  const lease = await getLeaseById(id);

  // Delete all attached files from disk
  (lease.docs || []).forEach(doc => {
    if (doc.url) {
      const filePath = path.join(__dirname, "../../", doc.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });

  await repo.delete(id);
};
