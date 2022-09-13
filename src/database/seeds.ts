import dotenv from "dotenv";
dotenv.config();
import database, { IBlockchain } from ".";

import { Logger } from "tslog";

const log = new Logger();

async function seed(): Promise<void> {
  log.info("seed start");
  await database.connect();
  const blockchains: IBlockchain[] = [
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
  log.info("Blockchain.insertMany");
  await database.Blockchain.insertMany(blockchains);
  log.info("seed done");
}

seed();
