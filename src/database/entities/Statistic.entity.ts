import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  blockchains: number;
  @Column({ nullable: true })
  contracts: number;
  @Column({ nullable: true })
  reports: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
