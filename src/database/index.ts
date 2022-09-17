import { AppDataSource } from "./data-source";

import { Report } from "./entities/Report.entity";
import { Contract } from "./entities/Contract.entity";
import { Blockchain } from "./entities/Blockchain.entity";
import { Logger } from "tslog";

const log = new Logger();

export async function connect(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    log.info("Connecting to Postgres...");
    await AppDataSource.initialize();
  }
}

export async function disconnect(): Promise<void> {
  if (AppDataSource.isInitialized) {
    log.info("Disconnecting from Postgres...");
    await AppDataSource.destroy();
  }
}

export { Report, Contract, Blockchain };

export default AppDataSource;
