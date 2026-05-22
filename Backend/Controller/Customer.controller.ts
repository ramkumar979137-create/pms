import { Request, Response } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../Service/Customer.service";

export const create = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const customer = await getCustomerById(Number(req.params.id));
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const customer = await updateCustomer(Number(req.params.id), req.body);
    res.json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await deleteCustomer(Number(req.params.id));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
