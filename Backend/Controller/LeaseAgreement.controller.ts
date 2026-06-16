// Controller/LeaseAgreement.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../Entity/User";
import { Customer } from "../Entity/Customer";
import {
  createLease,
  getAllLeases,
  getLeaseById,
  updateLease,
  deleteDocument,
  deleteLease,
} from "../Service/LeaseAgreement.service";

/* ── CREATE ── */
export const create = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];

    const payload = {
      ...req.body,

      // Direct save identifier values
      userId: req.body.userId,
      customerId: req.body.customerId,

      propertyId: req.body.propertyId
        ? Number(req.body.propertyId)
        : undefined,
    };

    if (!payload.userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!payload.customerId) {
      return res.status(400).json({
        message: "customerId is required",
      });
    }

    if (!payload.propertyId) {
      return res.status(400).json({
        message: "propertyId is required",
      });
    }

    const lease = await createLease(payload, files);

    return res.status(201).json({
      message: "Lease agreement created",
      lease,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/* ── GET ALL ── */
export const getAll = async (req: Request, res: Response) => {
  try {
    const { status, tenant, landlord, property } = req.query;
    const parseNumber = (v: any): number | undefined => {
      if (v === null || v === undefined || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const customerId = req.query.customerId as string;
    const userId = req.query.userId as string;

    const leases = await getAllLeases({
      status:     status   as string,
      tenant:     tenant   as string,
      landlord:   landlord as string,
      property:   property as string,
      customerId,
      userId,
    });

    res.status(200).json({ leases });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── GET MY ACTIVE LEASES ── */
export const getMyActive = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;

    // Resolve the string user identifier (e.g. USR_xxx) to query lease identifier column
    let userIdentifier: string | undefined = undefined;

    if (authReq.userIdentifier) {
      userIdentifier = authReq.userIdentifier;
    } else if (authReq.userId) {
      // token may include numeric `id`; load the user record to get its `userId` string
      const userRepo = AppDataSource.getRepository(User);
      const found = await userRepo.findOne({ where: { id: Number(authReq.userId) } });
      if (found) userIdentifier = found.userId;
    }

    if (!userIdentifier) return res.status(401).json({ message: "Unauthorized: user not identified" });

    const leases = await getAllLeases({ status: "Active", userId: userIdentifier });

    // Map to lightweight shape for frontend dropdown
    const mapped = leases.map(l => ({
      id: l.leaseId || `LSE-${String(l.id).padStart(3, "0")}`,
      customer: l.customerName || l.tenant || "",
      property: l.propertyAddress || l.property || "",
      leaseStart: l.startDate || null,
      leaseEnd: l.endDate || null,
      value: l.leaseValueAmount || l.monthlyRent || 0,
      raw: l,
    }));

    return res.status(200).json({ leases: mapped });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/* ── GET ONE ── */
export const getOne = async (req: Request, res: Response) => {
  try {
    const lease = await getLeaseById(Number(req.params.id));
    res.status(200).json({ lease });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── UPDATE ── */
export const update = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] || [];
    const parseNumber = (v: any): number | undefined => {
      if (v === null || v === undefined || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    let payload: any = {
      ...req.body,
      // keep identifier strings from client when present
      customerId: req.body.customerId,
      propertyId: parseNumber(req.body.propertyId),
    };

    // If userIdentifier provided (string), prefer it; otherwise resolve numeric id -> string userId
    if (!payload.userId && (req as any).userIdentifier) {
      const userRepo = AppDataSource.getRepository(User);
      const found = await userRepo.findOne({ where: { userId: (req as any).userIdentifier } });
      if (found) payload.userId = found.userId;
    }
    if (!payload.userId && req.body.userIdentifier) {
      const userRepo = AppDataSource.getRepository(User);
      const found = await userRepo.findOne({ where: { userId: req.body.userIdentifier } });
      if (found) payload.userId = found.userId;
    }
    // If customerIdentifier provided, resolve to customer identifier string (not numeric PK)
    if (!payload.customerId && (req as any).customerIdentifier) {
      try {
        const custRepo = AppDataSource.getRepository(Customer);
        const foundCust = await custRepo.findOne({ where: { customerId: (req as any).customerIdentifier } });
        if (foundCust) payload.customerId = foundCust.customerId;
      } catch (e) {
        // ignore
      }
    }
    if (!payload.customerId && req.body.customerIdentifier) {
      try {
        const custRepo = AppDataSource.getRepository(Customer);
        const foundCust = await custRepo.findOne({ where: { customerId: req.body.customerIdentifier } });
        if (foundCust) payload.customerId = foundCust.customerId;
      } catch (e) {
        // ignore
      }
    }
    const lease = await updateLease(Number(req.params.id), payload, files);

    res.status(200).json({ message: "Lease agreement updated", lease });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── REMOVE DOC ── */
export const removeDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const lease = await deleteDocument(Number(id), fileName);
    res.status(200).json({ message: "Document removed", lease });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── DELETE LEASE ── */
export const remove = async (req: Request, res: Response) => {
  try {
    await deleteLease(Number(req.params.id));
    res.status(200).json({ message: "Lease agreement deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
