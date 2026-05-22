import { AppDataSource } from "../config/data-source";
import { Property } from "../Entity/Property";
import { CreatePropertyDTO, UpdatePropertyDTO } from "../DTO/Property.dto";

const repo = AppDataSource.getRepository(Property);

export const createProperty = async (data: CreatePropertyDTO): Promise<Property> => {
  const property = repo.create(data);
  return await repo.save(property);
};

export const getAllProperties = async (): Promise<Property[]> => {
  return await repo.find({ order: { createdAt: "DESC" } });
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