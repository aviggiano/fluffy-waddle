import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Explorer } from "../../tools/explorer";

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caip: string;
  @Column()
  name: string;
  @Column()
  explorer: Explorer;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
