import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Customer } from "./Customer";
import { User } from "./User";
import { Property } from "./Property";

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
  propertyId!: number;

  @ManyToOne(() => Property, { nullable: true })
  @JoinColumn({ name: "propertyId" })
  propertyRef?: Property;

  @Column({ nullable: true })
  propertyUnit!: string;

  @Column({ nullable: true })
  propertyType!: string;

  @Column({ type: "text", nullable: true })
  propertyAddress!: string;

  @Column({ nullable: true })
  customerName!: string;

  @Column({ type: "date" })
  startDate!: string;

  @Column({ type: "date" })
  endDate!: string;

  @Column({ default: "12" })
  leaseTerm!: string;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  leaseValueAmount!: number;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  advanceAmount!: number;

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

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  delayPenaltyAmount!: number;

  @Column({ type: "text", nullable: true })
  terms!: string;

  @Column({ type: "text", nullable: true })
  notes!: string;

  @Column({ default: false })
  autoRenewal!: boolean;

  @Column({ default: false })
  petsAllowed!: boolean;

  @Column("json", { nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  @Column()
  customerId!: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerId" })
  customer?: Customer;

  @Column()
  userId!: string;

  // @Column({ nullable: true })
  // userIdentifier?: string;

  // @Column({ nullable: true })
  // customerIdentifier?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  user?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateLeaseId() {
    this.leaseId = "LSE_" + uuidv4();
  }
}
