import { Request, Response } from "express";
import { createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor } from "../Service/Vendor.service";

export const create = async (req: Request, res: Response) => {
  try {
    const vendorData = {
      ...req.body,
      createdByUserId: (req as any).userId || null,
    };
    const vendor = await createVendor(vendorData);
    res.status(201).json(vendor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = String(req.query.search || "");
    const service = String(req.query.service || "");
    const status = String(req.query.status || "");

    const vendors = await getAllVendors({ page, limit, search, service, status });
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const vendor = await getVendorById(Number(req.params.id));
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const vendor = await updateVendor(Number(req.params.id), req.body);
    res.json(vendor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteVendor(Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
