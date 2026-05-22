import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("lease_agreements")
export class LeaseAgreement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  leaseId!: string;

  @Column()
  tenant!: string;

  @Column()
  landlord!: string;

  @Column()
  property!: string;

  @Column({ nullable: true })
  propertyUnit!: string;

  @Column({ nullable: true })
  propertyType!: string;

  @Column({ type: "text", nullable: true })
  propertyAddress!: string;

  @Column({ type: "date" })
  startDate!: string;

  @Column({ type: "date" })
  endDate!: string;

  @Column({ default: "12" })
  leaseTerm!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  monthlyRent!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  securityDeposit!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  maintenanceCharge!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  utilityCharge!: number;

  @Column({ default: "INR" })
  currency!: string;

  @Column({ type: "int", default: 1 })
  rentDueDay!: number;

  @Column({ nullable: true })
  paymentMode!: string;

  @Column({ default: "Active" })
  status!: string;

  @Column({ type: "int", default: 0 })
  increasePercentage!: number;

  @Column({ type: "text", nullable: true })
  terms!: string;

  @Column({ type: "text", nullable: true })
  notes!: string;

  @Column({ default: false })
  autoRenewal!: boolean;

  @Column("json", { nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateLeaseId() {
    this.leaseId = "LSE_" + uuidv4();
  }
}
