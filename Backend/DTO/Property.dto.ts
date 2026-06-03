export interface CreatePropertyDTO {
  name: string;
  type: string;
  address: string;
  occupancy?: string;
  owner?: string;
  status?: string;
  purchasedOn?: string;
  purchaseValue?: number;
  currency?: string;
  maintenancePhone?: string;
  maintenanceEmail?: string;
  notes?: string;
}

export interface UpdatePropertyDTO extends Partial<CreatePropertyDTO> {}

export interface PropertyQueryParams {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  status?: string;
}