import { AppDataSource } from "../config/data-source";
import { Property } from "../Entity/Property";
import { CreatePropertyDTO, UpdatePropertyDTO, PropertyQueryParams } from "../DTO/Property.dto";

const repo = AppDataSource.getRepository(Property);

export const createProperty = async (data: CreatePropertyDTO): Promise<Property> => {
  const property = repo.create(data);
  return await repo.save(property);
};

export const getAllProperties = async (params: PropertyQueryParams): Promise<{ items: Property[]; total: number; page: number; limit: number }> => {
  const { page, limit, search, type, status } = params;
  const skip = (page - 1) * limit;

  let query = repo.createQueryBuilder("property");

  // Search filter
  if (search && search.trim()) {
    query = query.where(
      "(property.name ILIKE :search OR property.address ILIKE :search OR property.owner ILIKE :search)",
      { search: `%${search}%` }
    );
  }

  // Type filter
  if (type && type !== "ALL") {
    query = query.andWhere("property.type = :type", { type });
  }

  // Status filter
  if (status && status !== "ALL") {
    query = query.andWhere("property.status = :status", { status });
  }

  const [items, total] = await query
    .orderBy("property.createdAt", "DESC")
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  return { items, total, page, limit };
};

export const getPropertyById = async (id: number): Promise<Property | null> => {
  return await repo.findOneBy({ id });
};

export const updateProperty = async (id: number, data: UpdatePropertyDTO): Promise<Property> => {
  const property = await getPropertyById(id);
  if (!property) throw new Error("Property not found");
  Object.assign(property, data);
  return await repo.save(property);
};

export const deleteProperty = async (id: number): Promise<void> => {
  await repo.delete(id);
};