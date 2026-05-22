// DTO/RentalAgreement.dto.ts

export interface CreateRentalDTO {
  tenant:           string;
  property:         string;
  propertyUnit?:    string;
  propertyType?:    string;
  start:            string;
  end:              string;
  periodType?:      string;
  rent:             number;
  deposit?:         number;
  maintenanceCharge?: number;
  currency?:        string;
  rentDueDay?:      number;
  paymentMode?:     string;
  status?:          string;
  specialTerms?:    string;
  notes?:           string;
  autoRenew?:       boolean;
  userId:           number;
}

export interface UpdateRentalDTO extends Partial<CreateRentalDTO> {}