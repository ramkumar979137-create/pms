import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("properties")
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string; // APARTMENT, VILLA, HOUSE, COMMERCIAL, PLOT

  @Column()
  address!: string;

  @Column({ nullable: true })
  occupancy?: string; // Owned, Leased, Rented

  @Column({ nullable: true })
  owner?: string;

  @Column({ default: "VACANT" })
  status!: string; // OCCUPIED, VACANT

  @Column({ nullable: true })
  purchasedOn?: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  purchaseValue?: number;

  @Column({ default: "INR" })
  currency!: string; // INR, USD

  @Column({ nullable: true })
  maintenancePhone?: string;

  @Column({ nullable: true })
  maintenanceEmail?: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "int", nullable: true })
  createdByUserId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}