// Entity/RentalCancellation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("rental_cancellations")
export class RentalCancellation {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  cancellationId!: string;                // e.g. RCL_<uuid>

  @Column()
  rentalId!: string;                      // Link to RentalAgreement.rentalId

  @Column()
  tenant!: string;

  @Column()
  property!: string;

  @Column({ nullable: true })
  propertyUnit!: string;

  @Column({ type: "date" })
  originalEndDate!: string;               // Original end date of rental

  @Column({ type: "date" })
  cancellationDate!: string;              // Actual cancellation date

  @Column({ type: "int", default: 0 })
  noticeDaysGiven!: number;               // Days notice given

  @Column({ default: "Pending" })
  status!: string;                        // Pending, Approved, Rejected, Completed

  @Column({ type: "varchar", length: 50 })
  reason!: string;                        // Tenant Request, Landlord Request, Mutual Agreement, etc.

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  refundAmount!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  deductionAmount!: number;

  @Column({ type: "text", nullable: true })
  remarks!: string;

  @Column({ type: "json", nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateCancellationId() {
    this.cancellationId = "RCL_" + uuidv4();
  }
}
