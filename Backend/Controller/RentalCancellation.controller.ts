// Controller/RentalCancellation.controller.ts
import { Request, Response } from "express";
import {
  createCancellation,
  getAllCancellations,
  getCancellationById,
  updateCancellation,
  deleteDocument,
  deleteCancellation,
} from "../Service/RentalCancellation.service";

/* ── CREATE ── */
export const create = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] || [];
    const cancellation = await createCancellation(req.body, files);

    res.status(201).json({ message: "Cancellation request created", cancellation });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── GET ALL ── */
export const getAll = async (req: Request, res: Response) => {
  try {
    const { status, reason, tenant, property } = req.query;

    const cancellations = await getAllCancellations({
      status:   status   as string,
      reason:   reason   as string,
      tenant:   tenant   as string,
      property: property as string,
    });

    res.status(200).json({ cancellations });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── GET ONE ── */
export const getOne = async (req: Request, res: Response) => {
  try {
    const cancellation = await getCancellationById(Number(req.params.id));
    res.status(200).json({ cancellation });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── UPDATE ── */
export const update = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] || [];
    const cancellation = await updateCancellation(Number(req.params.id), req.body, files);

    res.status(200).json({ message: "Cancellation request updated", cancellation });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── REMOVE DOC ── */
export const removeDoc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const cancellation = await deleteDocument(Number(id), fileName);
    res.status(200).json({ message: "Document removed", cancellation });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* ── DELETE CANCELLATION ── */
export const remove = async (req: Request, res: Response) => {
  try {
    await deleteCancellation(Number(req.params.id));
    res.status(200).json({ message: "Cancellation request deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
