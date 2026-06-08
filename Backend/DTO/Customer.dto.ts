export interface CreateCustomerDTO {
  firstName: string;
  lastName?: string;
  type: string;
  occupation?: string;
  gender?: string;
  dob?: string;
  address?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  idProofType?: string;
  idProofNumber?: string;
  status?: string;
  notes?: string;
  password?: string;
  createdByUserId?: string;
  customerId?: string;
  docs?: { name: string; url?: string; type?: string; uploadedAt?: string }[];
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}
