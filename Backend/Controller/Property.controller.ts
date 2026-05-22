import { Request, Response } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../Service/Property.service";

export const create = async (req: Request, res: Response) => {
  try {
    const property = await createProperty(req.body);
    res.status(201).json(property);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const properties = await getAllProperties();
    res.json(properties);
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