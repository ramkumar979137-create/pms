// Entity/RentalAgreement.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("rental_agreements")
export class RentalAgreement {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  rentalId!: string;                  // e.g. RNT_<uuid>

  @Column()
  tenant!: string;                    // tenant name

  @Column()
  property!: string;                  // property name

  @Column({ nullable: true })
  propertyUnit!: string;              // unit number e.g. "3B"

  @Column({ nullable: true })
  propertyType!: string;              // Residential / Commercial / Villa

  @Column({ type: "date" })
  start!: string;

  @Column({ type: "date" })
  end!: string;

  @Column({ default: "Monthly" })
  periodType!: string;                // Monthly / Quarterly / Half-Year / Annual

  @Column("decimal", { precision: 10, scale: 2 })
  rent!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  deposit!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  maintenanceCharge!: number;

  @Column({ default: "INR" })
  currency!: string;

  @Column({ type: "int", default: 1 })
  rentDueDay!: number;                // day of month rent due (1–28)

  @Column({ nullable: true })
  paymentMode!: string;               // Bank / UPI / Cash / Cheque

  @Column({ default: "Active" })
  status!: string;                    // Active / Expired / Cancelled

  @Column({ type: "text", nullable: true })
  specialTerms!: string;

  @Column({ type: "text", nullable: true })
  notes!: string;

  @Column({ default: false })
  autoRenew!: boolean;

  // Documents stored as JSON array
  @Column("json", { nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  // Who created this record (store userId)
  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateRentalId() {
    this.rentalId = "RNT_" + uuidv4();
  }
}