import { AppDataSource } from "../config/data-source";
import { Customer } from "../Entity/Customer";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../DTO/Customer.dto";
import path from "path";
import fs from "fs";

const repo = AppDataSource.getRepository(Customer);

/* ── Upload dir ── */
const UPLOAD_DIR = path.join(__dirname, "../../uploads/customers");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const saveFiles = (
  files: Express.Multer.File[]
): { name: string; url: string; type: string; uploadedAt: string }[] => {
  return files.map((file) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
    const destPath = path.join(UPLOAD_DIR, safeName);
    fs.writeFileSync(destPath, file.buffer);
    return {
      name: file.originalname,
      url: `/uploads/customers/${safeName}`,
      type: ext.replace(".", "").toLowerCase(),
      uploadedAt: new Date().toISOString(),
    };
  });
};

export const createCustomer = async (data: CreateCustomerDTO, files: Express.Multer.File[] = []): Promise<Customer> => {
  const savedDocs = saveFiles(files);
  const customer = repo.create({
    ...data,
    docs: savedDocs,
  });
  return await repo.save(customer);
};

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export const getAllCustomers = async (params: CustomerQueryParams = {}): Promise<{ items: Customer[]; total: number; page: number; limit: number }> => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = params.search?.trim();
  const type = params.type?.trim();
  const status = params.status?.trim();

  const qb = repo.createQueryBuilder("customer");

  if (search) {
    qb.andWhere(
      `(customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.email LIKE :search OR customer.phone LIKE :search OR customer.idProofNumber LIKE :search OR CONCAT(customer.firstName, ' ', customer.lastName) LIKE :search)`,
      { search: `%${search}%` }
    );
  }

  if (type && type !== "ALL") {
    qb.andWhere("customer.type = :type", { type });
  }

  if (status && status !== "ALL") {
    qb.andWhere("customer.status = :status", { status });
  }

  const total = await qb.getCount();
  const items = await qb
    .orderBy("customer.id", "DESC")
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return { items, total, page, limit };
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  return await repo.findOneBy({ id });
};

export const updateCustomer = async (id: number, data: UpdateCustomerDTO, files: Express.Multer.File[] = []): Promise<Customer> => {
  const customer = await getCustomerById(id);
  if (!customer) throw new Error("Customer not found");
  const newDocs = saveFiles(files);
  const mergedDocs = [...(customer.docs || []), ...newDocs];
  Object.assign(customer, data);
  if (newDocs.length > 0) customer.docs = mergedDocs;
  return await repo.save(customer);
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await repo.delete(id);
};
