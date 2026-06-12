// Service/LeaseAgreement.service.ts
import { AppDataSource }          from "../config/data-source";
import { LeaseAgreement }         from "../Entity/LeaseAgreement";
import { User } from "../Entity/User";
import { Customer } from "../Entity/Customer";
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
  // Helpers to coerce incoming values
  const toNumber = (v: any, fallback?: number) => {
    if (v === null || v === undefined || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const toBoolean = (v: any) => {
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1' || v === 1) return true;
    return false;
  };

  // Basic validation for required fields
  // `tenant` is optional because frontend sends `customerId`/`customerName` instead.
  // Default tenant to customerName when available to keep readable records.
  if (!data.startDate) throw new Error('Missing startDate');
  if (!data.endDate) throw new Error('Missing endDate');

  // Normalize/validate leaseTerm
  const rawLeaseTerm = (data as any).leaseTerm;
  let normalizedLeaseTerm = "12";
  if (rawLeaseTerm !== null && rawLeaseTerm !== undefined && String(rawLeaseTerm).trim() !== "") {
    const nlt = Number(rawLeaseTerm);
    normalizedLeaseTerm = Number.isFinite(nlt) && nlt > 0 ? String(Math.floor(nlt)) : "12";
  }

  // Parse numeric monetary fields but keep them nullable when not provided
  const parsedLeaseValue = toNumber((data as any).leaseValueAmount, undefined);
  const parsedAdvance = toNumber((data as any).advanceAmount, undefined);
  const parsedDelayPenalty = toNumber((data as any).delayPenaltyAmount, undefined);

  // Reject negative monetary values as invalid input
  if (typeof parsedLeaseValue === 'number' && parsedLeaseValue < 0) throw new Error('Invalid leaseValueAmount');
  if (typeof parsedAdvance === 'number' && parsedAdvance < 0) throw new Error('Invalid advanceAmount');
  if (typeof parsedDelayPenalty === 'number' && parsedDelayPenalty < 0) throw new Error('Invalid delayPenaltyAmount');

  const leasePayload: any = {
    ...data,
    tenant: (data as any).tenant ?? (data as any).customerName ?? "",
    customerName: (data as any).customerName ?? "",
    leaseTerm: normalizedLeaseTerm,
    monthlyRent: toNumber((data as any).monthlyRent, 0),
    securityDeposit: toNumber((data as any).securityDeposit, 0),
    maintenanceCharge: toNumber((data as any).maintenanceCharge, 0),
    utilityCharge: toNumber((data as any).utilityCharge, 0),
    leaseValueAmount: parsedLeaseValue,
    advanceAmount: parsedAdvance,
    delayPenaltyAmount: parsedDelayPenalty,
    increasePercentage: toNumber((data as any).increasePercentage, 0),
    rentDueDay: toNumber((data as any).rentDueDay, 1),
    customerId: toNumber((data as any).customerId),
    propertyId: toNumber((data as any).propertyId),
    userId: toNumber((data as any).userId),
    autoRenewal: toBoolean((data as any).autoRenewal),
    petsAllowed: toBoolean((data as any).petsAllowed),
    docs: savedDocs,
  };

  // Resolve and include identifier strings (USR_xxx, CUS_xxx) when possible
  if (!leasePayload.userIdentifier) {
    // if numeric userId is present, try to fetch the userIdentifier
    if (leasePayload.userId) {
      try {
        const userRepo = AppDataSource.getRepository(User);
        const u = await userRepo.findOne({ where: { id: leasePayload.userId } });
        if (u && (u as any).userId) leasePayload.userIdentifier = (u as any).userId;
      } catch (e) {
        // ignore lookup failures
      }
    }
  }
  if (!leasePayload.customerIdentifier) {
    if (leasePayload.customerId) {
      try {
        const custRepo = AppDataSource.getRepository(Customer);
        const c = await custRepo.findOne({ where: { id: leasePayload.customerId } });
        if (c && (c as any).customerId) leasePayload.customerIdentifier = (c as any).customerId;
      } catch (e) {
        // ignore lookup failures
      }
    }
  }

  const lease = repo.create(leasePayload);
  // repo.save may return the entity or an array (depending on input), normalize to a single object
  let savedResult: any = await repo.save(lease);
  let savedLease: any = Array.isArray(savedResult) ? savedResult[0] : savedResult;

  // Generate a human-friendly sequential leaseId like LSE-001 using the DB id
  try {
    const generated = `LSE-${String(savedLease.id).padStart(3, "0")}`;
    if (!savedLease.leaseId || savedLease.leaseId !== generated) {
      savedLease.leaseId = generated;
      savedResult = await repo.save(savedLease);
    }
  } catch (err) {
    // ignore leaseId generation errors and return the saved entity
  }

  return (Array.isArray(savedResult) ? savedResult[0] : savedResult) as LeaseAgreement;
};

/* ──────────────────────────────────────
   GET ALL LEASES (with filters)
────────────────────────────────────── */
export const getAllLeases = async (filters: {
  status?:   string;
  tenant?:   string;
  landlord?: string;
  property?: string;
  propertyId?: number;
  customerId?: number;
  userId?: number;
}): Promise<LeaseAgreement[]> => {

  const qb = repo.createQueryBuilder("l");

  if (filters.status)   qb.andWhere("l.status   = :status",   { status:   filters.status   });
  if (filters.tenant)   qb.andWhere("l.tenant   LIKE :tenant", { tenant:  `%${filters.tenant}%`   });
  if (filters.landlord) qb.andWhere("l.landlord LIKE :landlord", { landlord:  `%${filters.landlord}%` });
  if (filters.property) qb.andWhere("l.property LIKE :prop",   { prop:    `%${filters.property}%` });
  if (typeof filters.propertyId !== "undefined") qb.andWhere("l.propertyId = :propertyId", { propertyId: filters.propertyId });
  if (typeof filters.customerId !== "undefined") qb.andWhere("l.customerId = :customerId", { customerId: filters.customerId });
  if (typeof filters.userId !== "undefined") qb.andWhere("l.userId = :userId", { userId: filters.userId });

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
  const toNumber = (v: any, fallback?: number) => {
    if (v === null || v === undefined || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const toBoolean = (v: any) => {
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1' || v === 1) return true;
    return false;
  };

  const cleaned: any = { ...data };
  if (typeof (data as any).monthlyRent !== 'undefined') cleaned.monthlyRent = toNumber((data as any).monthlyRent, lease.monthlyRent);
  if (typeof (data as any).securityDeposit !== 'undefined') cleaned.securityDeposit = toNumber((data as any).securityDeposit, lease.securityDeposit);
  if (typeof (data as any).maintenanceCharge !== 'undefined') cleaned.maintenanceCharge = toNumber((data as any).maintenanceCharge, lease.maintenanceCharge);
  if (typeof (data as any).utilityCharge !== 'undefined') cleaned.utilityCharge = toNumber((data as any).utilityCharge, lease.utilityCharge);
  if (typeof (data as any).leaseValueAmount !== 'undefined') cleaned.leaseValueAmount = toNumber((data as any).leaseValueAmount, (lease as any).leaseValueAmount);
  if (typeof (data as any).advanceAmount !== 'undefined') cleaned.advanceAmount = toNumber((data as any).advanceAmount, (lease as any).advanceAmount);
  if (typeof (data as any).delayPenaltyAmount !== 'undefined') cleaned.delayPenaltyAmount = toNumber((data as any).delayPenaltyAmount, (lease as any).delayPenaltyAmount);
  if (typeof (data as any).increasePercentage !== 'undefined') cleaned.increasePercentage = toNumber((data as any).increasePercentage, lease.increasePercentage);
  if (typeof (data as any).rentDueDay !== 'undefined') cleaned.rentDueDay = toNumber((data as any).rentDueDay, lease.rentDueDay);
  if (typeof (data as any).customerId !== 'undefined') cleaned.customerId = toNumber((data as any).customerId, lease.customerId);
  if (typeof (data as any).propertyId !== 'undefined') cleaned.propertyId = toNumber((data as any).propertyId, lease.propertyId);
  if (typeof (data as any).userId !== 'undefined') cleaned.userId = toNumber((data as any).userId, lease.userId);
  if (typeof (data as any).autoRenewal !== 'undefined') cleaned.autoRenewal = toBoolean((data as any).autoRenewal);
  if (typeof (data as any).petsAllowed !== 'undefined') cleaned.petsAllowed = toBoolean((data as any).petsAllowed);

  Object.assign(lease, { ...cleaned, docs: mergedDocs });
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
