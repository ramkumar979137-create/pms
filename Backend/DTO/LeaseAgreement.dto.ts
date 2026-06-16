// DTO/LeaseAgreement.dto.ts
export interface CreateLeaseDTO {
  tenant:              string;
  landlord:            string;
  property:            string;
  propertyId?:         number;
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
  leaseValueAmount?:   number;
  advanceAmount?:      number;
  delayPenaltyAmount?: number;
  petsAllowed?:        boolean;
  terms?:              string;
  notes?:              string;
  autoRenewal?:        boolean;
  userId:              number | string;
  customerId:          number | string;
}

export interface UpdateLeaseDTO extends Partial<CreateLeaseDTO> {
  status?: "Active" | "Expired" | "Terminated" | "Renewal Pending";
  customerId?: number | string;
  propertyId?: number;
}
