export interface CreatePropertyDTO {
  name: string;
  type: string;
  units?: number;
  city?: string;
  address?: string;
  owner?: string;
  status?: string;
}

export interface UpdatePropertyDTO extends Partial<CreatePropertyDTO> {}