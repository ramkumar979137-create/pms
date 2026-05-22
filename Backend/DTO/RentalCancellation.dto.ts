// DTO/RentalCancellation.dto.ts
export interface CreateCancellationDTO {
  rentalId:         string;
  tenant:           string;
  property:         string;
  propertyUnit?:    string;
  originalEndDate:  string;
  cancellationDate: string;
  noticeDaysGiven:  number;
  reason:           string;
  refundAmount?:    number;
  deductionAmount?: number;
  remarks?:         string;
  userId:           number;
}

export interface UpdateCancellationDTO extends Partial<CreateCancellationDTO> {
  status?: "Pending" | "Approved" | "Rejected" | "Completed";
}
