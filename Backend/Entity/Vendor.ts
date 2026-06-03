import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("vendors")
export class Vendor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  vendorCode!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  service?: string;

  @Column({ nullable: true })
  contact?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true, type: "text" })
  address?: string;

  @Column({ nullable: true })
  idProofType?: string;

  @Column({ nullable: true })
  idProofNumber?: string;

  @Column({ nullable: true, type: "text" })
  accountDetails?: string;

  @Column({ type: "float", default: 0 })
  rating!: number;

  @Column({ default: "Active" })
  status!: string;

  @Column({ default: false })
  preferred!: boolean;

  @Column({ nullable: true, type: "text" })
  comments?: string;

  @Column("simple-array", { nullable: true })
  fileNames?: string[];

  @Column({ default: 0 })
  jobs!: number;

  @Column({ nullable: true })
  createdByUserId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
