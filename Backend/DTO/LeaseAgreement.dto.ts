// DTO/LeaseAgreement.dto.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("lease_agreements")
export class LeaseAgreement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  leaseId!: string;

  @Column()
  status!: string;

  @Column()
  customerId!: string;

  @Column()
  customerName!: string;

  @Column()
  propertyId!: number;

  @Column()
  propertyUnit!: string;

  @Column({ type: "text", nullable: true })
  propertyAddress!: string;

  @Column({ nullable: true })
  leaseDuration!: string;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date" })
  endDate!: Date;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  leaseValueAmount!: number;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  advanceAmount!: number;

  @Column("decimal", { precision: 12, scale: 2, nullable: true })
  delayPenaltyAmount!: number;

  @Column({ type: "date", nullable: true })
  paymentDate!: Date;

  @Column({ type: "date", nullable: true })
  exceptionDate!: Date;

  @Column({ default: false })
  petsAllowed!: boolean;

  @Column("simple-json", { nullable: true })
  files!: string[];

  @CreateDateColumn()
  createdAt!: Date;
}


