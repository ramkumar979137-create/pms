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
}

export interface UpdateCustomerDTO extends Partial<CreateCustomerDTO> {}
