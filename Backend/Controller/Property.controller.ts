import { Request, Response } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../Service/Property.service";
import { PropertyQueryParams } from "../DTO/Property.dto";

export const create = async (req: Request, res: Response) => {
  try {
    const propertyData = {
      ...req.body,
      createdByUserId: (req as any).userId,
    };
    const property = await createProperty(propertyData);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const search = req.query.search as string;
    const type = req.query.type as string;
    const status = req.query.status as string;

    const params: PropertyQueryParams = { page, limit, search, type, status };
    const result = await getAllProperties(params);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const property = await getPropertyById(Number(req.params.id));
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const property = await updateProperty(Number(req.params.id), req.body);
    res.json(property);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteProperty(Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};