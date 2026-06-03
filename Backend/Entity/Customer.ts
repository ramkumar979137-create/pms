import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: "TENANT" })
  type!: string;

  @Column({ nullable: true })
  occupation?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: "date", nullable: true })
  dob?: string;

  @Column({ nullable: true, type: "text" })
  address?: string;

  @Column({ nullable: true })
  countryCode?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  idProofType?: string;

  @Column({ nullable: true })
  idProofNumber?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true, type: "text" })
  notes?: string;

  @Column({ nullable: true })
  createdByUserId?: number;

  @Column({ nullable: true })
  password?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
