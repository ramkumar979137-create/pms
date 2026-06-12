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
    const files = req.files as Express.Multer.File[] || [];
    // prefer authenticated user id from token (attached by middleware), fallback to body
    const authReq = req as any;
    const parseNumber = (v: any): number | undefined => {
      if (v === null || v === undefined || v === "") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    let payload: any = {
      ...req.body,
      customerId: parseNumber(req.body.customerId),
      propertyId: parseNumber(req.body.propertyId),
    };

    // Resolve userId priority: numeric id from token -> numeric id from body -> userIdentifier from token/body -> lookup
    let resolvedUserId: number | undefined = undefined;
    if (authReq.userId) {
      resolvedUserId = Number(authReq.userId);
    } else if (parseNumber(req.body.userId)) {
      resolvedUserId = parseNumber(req.body.userId);
    } else if (authReq.userIdentifier || req.body.userIdentifier) {
      const identifier = (authReq.userIdentifier ?? req.body.userIdentifier) as string;
      if (identifier) {
        const userRepo = AppDataSource.getRepository(User);
        const found = await userRepo.findOne({ where: { userId: identifier } });
        if (found) resolvedUserId = found.id;
      }
    }

    payload.userId = resolvedUserId;

    // If customerId not provided as number, try resolving from customerIdentifier (e.g. CUS_xxx)
    if (typeof payload.customerId === "undefined") {
      const identifier = (req.body.customerIdentifier ?? (authReq.customerIdentifier ?? undefined)) as string | undefined;
      if (identifier) {
        try {
          const custRepo = AppDataSource.getRepository(Customer);
          const foundCust = await custRepo.findOne({ where: { customerId: identifier } });
          if (foundCust) {
            payload.customerId = foundCust.id;
            payload.customerIdentifier = identifier;
          }
        } catch (e) {
          // ignore lookup failures
        }
      }
    }

    // basic validation for required numeric fields
    if (typeof payload.userId === "undefined") {
      return res.status(400).json({ message: "Missing or invalid userId" });
    }
    if (typeof payload.customerId === "undefined") {
      return res.status(400).json({ message: "Missing or invalid customerId" });
    }
    if (typeof payload.propertyId === "undefined") {
      return res.status(400).json({ message: "Missing or invalid propertyId" });
    }

    const lease = await createLease(payload, files);

    res.status(201).json({ message: "Lease agreement created", lease });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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

    const customerId = parseNumber(req.query.customerId);
    const userId = parseNumber(req.query.userId);

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
      customerId: parseNumber(req.body.customerId),
      propertyId: parseNumber(req.body.propertyId),
    };

    // If userIdentifier provided (string), resolve to numeric id
    if (!payload.userId && (req as any).userIdentifier) {
      const userRepo = AppDataSource.getRepository(User);
      const found = await userRepo.findOne({ where: { userId: (req as any).userIdentifier } });
      if (found) payload.userId = found.id;
    }
    if (!payload.userId && req.body.userIdentifier) {
      const userRepo = AppDataSource.getRepository(User);
      const found = await userRepo.findOne({ where: { userId: req.body.userIdentifier } });
      if (found) payload.userId = found.id;
    }
    // If customerIdentifier provided, resolve to numeric id for updates too
    if (!payload.customerId && (req as any).customerIdentifier) {
      try {
        const custRepo = AppDataSource.getRepository(Customer);
        const foundCust = await custRepo.findOne({ where: { customerId: (req as any).customerIdentifier } });
        if (foundCust) payload.customerId = foundCust.id;
      } catch (e) {
        // ignore
      }
    }
    if (!payload.customerId && req.body.customerIdentifier) {
      try {
        const custRepo = AppDataSource.getRepository(Customer);
        const foundCust = await custRepo.findOne({ where: { customerId: req.body.customerIdentifier } });
        if (foundCust) payload.customerId = foundCust.id;
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
