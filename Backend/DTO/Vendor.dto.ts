export interface CreateVendorDTO {
  vendorCode?: string;
  name: string;
  service?: string;
  contact?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  idProofType?: string;
  idProofNumber?: string;
  accountDetails?: string;
  rating?: number;
  status?: string;
  preferred?: boolean;
  comments?: string;
  fileNames?: string[];
  jobs?: number;
  createdByUserId?: number;
}

export interface UpdateVendorDTO extends Partial<CreateVendorDTO> {}
