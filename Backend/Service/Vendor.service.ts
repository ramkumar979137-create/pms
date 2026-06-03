import { AppDataSource } from "../config/data-source";
import { Vendor } from "../Entity/Vendor";
import { CreateVendorDTO, UpdateVendorDTO } from "../DTO/Vendor.dto";

const repo = AppDataSource.getRepository(Vendor);

export interface VendorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  service?: string;
  status?: string;
}

export const createVendor = async (data: CreateVendorDTO): Promise<Vendor> => {
  if (!data.vendorCode) {
    const lastVendor = await repo.createQueryBuilder("vendor").orderBy("vendor.id", "DESC").getOne();
    const nextId = lastVendor ? lastVendor.id + 1 : 1;
    data.vendorCode = `V-${String(nextId).padStart(3, "0")}`;
  }
  const vendor = repo.create(data);
  return await repo.save(vendor);
};

export const getAllVendors = async (params: VendorQueryParams = {}): Promise<{ items: Vendor[]; total: number; page: number; limit: number }> => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 20;
  const search = params.search?.trim();
  const service = params.service?.trim();
  const status = params.status?.trim();

  const qb = repo.createQueryBuilder("vendor");

  if (search) {
    qb.andWhere(
      `(vendor.name LIKE :search OR vendor.vendorCode LIKE :search OR vendor.city LIKE :search OR vendor.service LIKE :search OR vendor.contact LIKE :search OR vendor.email LIKE :search)`,
      { search: `%${search}%` }
    );
  }

  if (service && service !== "All") {
    qb.andWhere("vendor.service = :service", { service });
  }

  if (status && status !== "All") {
    qb.andWhere("vendor.status = :status", { status });
  }

  const total = await qb.getCount();
  const items = await qb
    .orderBy("vendor.id", "ASC")
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return { items, total, page, limit };
};

export const getVendorById = async (id: number): Promise<Vendor | null> => {
  return await repo.findOneBy({ id });
};

export const updateVendor = async (id: number, data: UpdateVendorDTO): Promise<Vendor> => {
  const vendor = await getVendorById(id);
  if (!vendor) throw new Error("Vendor not found");
  Object.assign(vendor, data);
  return await repo.save(vendor);
};

export const deleteVendor = async (id: number): Promise<void> => {
  await repo.delete(id);
};
