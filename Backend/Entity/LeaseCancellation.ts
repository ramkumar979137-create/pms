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

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  penaltyAmount!: number;

  @Column({ default: "Pending" })
  status!: string;

  @Column("json", { nullable: true })
  docs!: { name: string; url?: string; type?: string; uploadedAt?: string }[];

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateCancellationId() {
    this.cancellationId = "LCN_" + uuidv4();
  }
}
