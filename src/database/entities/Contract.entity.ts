import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
  ManyToOne,
} from "typeorm";
import { Blockchain } from "./Blockchain.entity";

@Entity()
@Unique("unique_address_per_blockchain", ["blockchain", "address"])
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blockchain, (blockchain) => blockchain.id, { eager: true })
  @JoinColumn()
  blockchain: Blockchain;

  @Column("int", { name: "blockchainId" })
  @Index()
  blockchainId: Blockchain["id"];

  @Column()
  @Index()
  address: string;
  @Column()
  name?: string;
  @Column()
  compiler?: string;
  @Column()
  version?: string;
  @Column()
  balance?: string;
  @Column()
  txns?: number;
  @Column()
  setting?: string;
  @Column()
  verified?: Date;
  @Column()
  audited?: string;
  @Column()
  license?: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
