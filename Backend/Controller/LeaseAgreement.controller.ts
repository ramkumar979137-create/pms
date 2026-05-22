// Controller/LeaseAgreement.controller.ts
import { Request, Response } from "express";
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
    const lease = await createLease(req.body, files);

    res.status(201).json({ message: "Lease agreement created", lease });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── GET ALL ── */
export const getAll = async (req: Request, res: Response) => {
  try {
    const { status, tenant, landlord, property } = req.query;

    const leases = await getAllLeases({
      status:   status   as string,
      tenant:   tenant   as string,
      landlord: landlord as string,
      property: property as string,
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
    const lease = await updateLease(Number(req.params.id), req.body, files);

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
