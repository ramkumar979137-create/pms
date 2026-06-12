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
  userId?:        number;

  customerId?: number;
  customerIdentifier?: string;
  customerName?: string;
  propertyId?: number;
  propertyAddress?: string;
  leaseValueAmount?: number;
  advanceAmount?: number;
  delayPenaltyAmount?: number;
  petsAllowed?: boolean;
  userIdentifier?: string;
}

export interface UpdateLeaseCancellationDTO extends Partial<CreateLeaseCancellationDTO> {
  status?: "Pending" | "Approved" | "Rejected";
}
