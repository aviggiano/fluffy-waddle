import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import database, { Blockchain, connect, disconnect } from ".";

import { Logger } from "tslog";

const log = new Logger();

async function seed(): Promise<void> {
  log.info("seed start");
  await connect();
  await database.synchronize();
  const blockchains: Omit<Blockchain, "id" | "createdAt" | "updatedAt">[] = [
    {
      caip: "eip155:1",
      name: "Ethereum Mainnet",
      explorer: "etherscan",
    },
    {
      caip: "eip155:137",
      name: "Polygon",
      explorer: "polygonscan",
    },
    {
      caip: "eip155:56",
      name: "BNB Chain",
      explorer: "bscscan",
    },
  ];
  log.info(`create ${blockchains.length} blockchains`);
  await database.manager.insert(Blockchain, blockchains);
  log.info("seed done");
  await disconnect();
}

seed();
