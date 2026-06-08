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
    const files = (req.files as Express.Multer.File[]) || [];
    // Prefer the string identifier from the decoded token (e.g. "USR_xxx").
    const incomingIdentifier = (req as any).userIdentifier ?? req.body.createdByUserId ?? null;
    const createdByUserId = incomingIdentifier !== undefined && incomingIdentifier !== null ? String(incomingIdentifier) : null;

    console.log("[CustomerController] create called - userIdentifier:", (req as any).userIdentifier, "incomingBody:", req.body, "filesCount:", files.length);

    const customerData = {
      ...req.body,
      createdByUserId,
    };

    const customer = await createCustomer(customerData, files);
    console.log("[CustomerController] created customer id:", customer?.id, "customerId:", customer?.customerId);
    res.status(201).json(customer);
  } catch (error: any) {
    console.error("[CustomerController] create error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");
    const type = String(req.query.type || "");
    const status = String(req.query.status || "");

    const customers = await getAllCustomers({ page, limit, search, type, status });
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
    const files = (req.files as Express.Multer.File[]) || [];
    const customer = await updateCustomer(Number(req.params.id), req.body, files);
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
