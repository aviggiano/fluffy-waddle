import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from "typeorm";

import { Tool } from "../../tools";
import { Contract } from "./Contract.entity";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, (contract) => contract.id, { eager: true })
  @JoinColumn()
  contract: Contract;

  @Column("int", { name: "contractId" })
  @Index()
  contractId: Contract["id"];

  @Column()
  tool: Tool;
  @Column()
  details: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
