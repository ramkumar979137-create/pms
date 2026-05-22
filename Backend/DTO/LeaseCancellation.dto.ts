export interface CreateLeaseCancellationDTO {
  leaseId:       string;
  tenant:        string;
  property:      string;
  propertyUnit?: string;
  requestDate:   string;
  vacateDate:    string;
  reason:        string;
  penaltyAmount?: number;
  status?:       string;
  userId:        number;
}

export interface UpdateLeaseCancellationDTO extends Partial<CreateLeaseCancellationDTO> {
  status?: "Pending" | "Approved" | "Rejected";
}
