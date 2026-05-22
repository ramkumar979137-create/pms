import { Request, Response } from "express";
import {
  createLeaseCancellation,
  deleteLeaseCancellation,
  deleteLeaseCancellationDocument,
  getAllLeaseCancellations,
  getLeaseCancellationById,
  updateLeaseCancellation,
} from "../Service/LeaseCancellation.service";

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createLeaseCancellation(req.body, req.files as Express.Multer.File[]);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Unable to create lease cancellation" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      tenant: req.query.tenant as string,
      property: req.query.property as string,
    };
    const data = await getAllLeaseCancellations(filters);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Unable to fetch lease cancellations" });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const data = await getLeaseCancellationById(Number(req.params.id));
    return res.json(data);
  } catch (error: any) {
    return res.status(404).json({ message: error.message || "Lease cancellation not found" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const data = await updateLeaseCancellation(Number(req.params.id), req.body, req.files as Express.Multer.File[]);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Unable to update lease cancellation" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const filename = Array.isArray(req.params.filename) ? req.params.filename[0] : req.params.filename;
    const data = await deleteLeaseCancellationDocument(Number(req.params.id), filename);
    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Unable to delete document" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteLeaseCancellation(Number(req.params.id));
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Unable to delete lease cancellation" });
  }
};
