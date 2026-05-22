import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("properties")
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string; // Residential, Commercial, Villa, etc.

  @Column({ type: "int", nullable: true })
  units?: number;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  owner?: string;

  @Column({ default: "Vacant" })
  status!: string; // Occupied, Partial, Vacant

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}