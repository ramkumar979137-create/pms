export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}
