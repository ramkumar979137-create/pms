import { AppDataSource } from "../config/data-source";
import { LeaseCancellation } from "../Entity/LeaseCancellation";
import { CreateLeaseCancellationDTO, UpdateLeaseCancellationDTO } from "../DTO/LeaseCancellation.dto";
import path from "path";
import fs from "fs";

const repo = AppDataSource.getRepository(LeaseCancellation);

const UPLOAD_DIR = path.join(__dirname, "../../uploads/lease-cancellation");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const saveFiles = (files: Express.Multer.File[]) => {
  return files.map((file) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    const destPath = path.join(UPLOAD_DIR, safeName);

    fs.writeFileSync(destPath, file.buffer);

    return {
      name: file.originalname,
      url: `/uploads/lease-cancellation/${safeName}`,
      type: ext.replace(".", "").toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  });
};

export const createLeaseCancellation = async (
  data: CreateLeaseCancellationDTO,
  files: Express.Multer.File[] = []
): Promise<LeaseCancellation> => {
  const savedDocs = saveFiles(files);
  const cancellation = repo.create({
    ...data,
    penaltyAmount: Number(data.penaltyAmount) || 0,
    status: data.status || "Pending",
    docs: savedDocs,
  });
  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as LeaseCancellation;
};

export const getAllLeaseCancellations = async (filters: {
  status?: string;
  tenant?: string;
  property?: string;
}): Promise<LeaseCancellation[]> => {
  const qb = repo.createQueryBuilder("lc");
  if (filters.status) qb.andWhere("lc.status = :status", { status: filters.status });
  if (filters.tenant) qb.andWhere("lc.tenant LIKE :tenant", { tenant: `%${filters.tenant}%` });
  if (filters.property) qb.andWhere("lc.property LIKE :property", { property: `%${filters.property}%` });
  return await qb.orderBy("lc.createdAt", "DESC").getMany();
};

export const getLeaseCancellationById = async (id: number): Promise<LeaseCancellation> => {
  const cancellation = await repo.findOne({ where: { id } });
  if (!cancellation) throw new Error("Lease cancellation request not found");
  return cancellation;
};

export const updateLeaseCancellation = async (
  id: number,
  data: UpdateLeaseCancellationDTO,
  files: Express.Multer.File[] = []
): Promise<LeaseCancellation> => {
  const cancellation = await getLeaseCancellationById(id);
  const newDocs = saveFiles(files);
  cancellation.docs = [...(cancellation.docs || []), ...newDocs];
  const updatedFields: Partial<LeaseCancellation> = {
    ...data,
    penaltyAmount: data.penaltyAmount !== undefined ? Number(data.penaltyAmount) : cancellation.penaltyAmount,
    status: data.status || cancellation.status,
  };
  Object.assign(cancellation, updatedFields);
  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as LeaseCancellation;
};

export const deleteLeaseCancellationDocument = async (id: number, fileName: string): Promise<LeaseCancellation> => {
  const cancellation = await getLeaseCancellationById(id);
  const doc = cancellation.docs?.find(d => d.name === fileName);
  if (doc?.url) {
    const filePath = path.join(__dirname, "../../", doc.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  cancellation.docs = (cancellation.docs || []).filter(d => d.name !== fileName);
  const result = await repo.save(cancellation);
  return (Array.isArray(result) ? result[0] : result) as LeaseCancellation;
};

export const deleteLeaseCancellation = async (id: number): Promise<void> => {
  const cancellation = await getLeaseCancellationById(id);
  (cancellation.docs || []).forEach(doc => {
    if (doc.url) {
      const filePath = path.join(__dirname, "../../", doc.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  });
  await repo.delete(id);
};
