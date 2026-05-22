import { AppDataSource } from "../config/data-source";
import { Customer } from "../Entity/Customer";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../DTO/Customer.dto";

const repo = AppDataSource.getRepository(Customer);

export const createCustomer = async (data: CreateCustomerDTO): Promise<Customer> => {
  const customer = repo.create(data);
  return await repo.save(customer);
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  return await repo.find({ order: { createdAt: "DESC" } });
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  return await repo.findOneBy({ id });
};

export const updateCustomer = async (id: number, data: UpdateCustomerDTO): Promise<Customer> => {
  const customer = await getCustomerById(id);
  if (!customer) throw new Error("Customer not found");
  Object.assign(customer, data);
  return await repo.save(customer);
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await repo.delete(id);
};
