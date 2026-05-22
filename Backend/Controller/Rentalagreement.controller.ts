// Controller/RentalAgreement.controller.ts
import { Request, Response } from "express";
import {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteDocument,
  deleteRental,
} from "../Service/Rentalagreement.service";

/* ── CREATE ── */
export const create = async (req: Request, res: Response) => {
  try {
    const files  = (req.files as Express.Multer.File[]) || [];
    const rental = await createRental(req.body, files);
    res.status(201).json({ message: "Rental agreement created", rental });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ── GET ALL ── */
export const getAll = async (req: Request, res: Response) => {
  try {
    const { status, tenant, property } = req.query as Record<string, string>;
    const rentals = await getAllRentals({ status, tenant, property });
    res.status(200).json({ rentals });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/* ── GET ONE ── */
export const getOne = async (req: Request, res: Response) => {
  try {
    const rental = await getRentalById(Number(req.params.id));
    res.status(200).json({ rental });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

/* ── UPDATE ── */
export const update = async (req: Request, res: Response) => {
  try {
    const files  = (req.files as Express.Multer.File[]) || [];
    const rental = await updateRental(Number(req.params.id), req.body, files);
    res.status(200).json({ message: "Rental agreement updated", rental });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ── DELETE ONE DOC ── */
export const removeDoc = async (req: Request, res: Response) => {
  try {
    const { id }       = req.params;
    const { fileName } = req.body;
    if (!fileName) {
      res.status(400).json({ message: "fileName is required" });
      return;
    }
    const rental = await deleteDocument(Number(id), fileName);
    res.status(200).json({ message: "Document removed", rental });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

/* ── DELETE RENTAL ── */
export const remove = async (req: Request, res: Response) => {
  try {
    await deleteRental(Number(req.params.id));
    res.status(200).json({ message: "Rental agreement deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};