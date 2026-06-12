import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("lease_cancellations")
export class LeaseCancellation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  cancellationId!: string;

  @Column()
  leaseId!: string;

  @Column()
  tenant!: string;

  @Column()
  property!: string;

  @Column({ nullable: true })
  propertyUnit!: string;

  @Column({ type: "date" })
  requestDate!: string;

  @Column({ type: "date" })
  vacateDate!: string;

  @Column({ type: "text" })
  reason!: string;

  @Column("decimal", { precision: 14, scale: 2, nullable: true })
  leaseValueAmount!: number | null;

  @Column("decimal", { precision: 14, scale: 2, nullable: true })
  advanceAmount!: number | null;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  delayPenaltyAmount!: number | null;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  penaltyAmount!: number | null;

  @Column({ default: "Pending" })
  status!: string;

  @Column("json", { nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  @Column({ nullable: true })
  customerId!: number | null;

  @Column({ nullable: true })
  customerName!: string | null;

  @Column({ nullable: true })
  propertyId!: number | null;

  @Column({ nullable: true })
  propertyAddress!: string | null;

  @Column({ nullable: true })
  userId!: number | null;

  @Column({ nullable: true })
  userIdentifier!: string | null;

  @Column({ nullable: true })
  customerIdentifier!: string | null;

  @Column({ default: false })
  petsAllowed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateCancellationId() {
    this.cancellationId = "LCN_" + uuidv4();
  }
}
