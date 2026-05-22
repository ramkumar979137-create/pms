// DTO/LeaseAgreement.dto.ts
export interface CreateLeaseDTO {
  tenant:              string;
  landlord:            string;
  property:            string;
  propertyUnit?:       string;
  propertyType?:       string;
  propertyAddress?:    string;
  startDate:           string;
  endDate:             string;
  leaseTerm?:          string;
  monthlyRent:         number;
  securityDeposit?:    number;
  maintenanceCharge?:  number;
  utilityCharge?:      number;
  rentDueDay?:         number;
  paymentMode?:        string;
  increasePercentage?: number;
  terms?:              string;
  notes?:              string;
  autoRenewal?:        boolean;
  userId:              number;
}

export interface UpdateLeaseDTO extends Partial<CreateLeaseDTO> {
  status?: "Active" | "Expired" | "Terminated" | "Renewal Pending";
}
