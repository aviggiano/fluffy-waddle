import dotenv from "dotenv";
dotenv.config();

import { listContractsVerified } from "../tools/explorer";
import database, { IContract } from "../database";
import parseDate from "date-fns/parse";
import { Logger } from "tslog";

const log = new Logger();

export default async function (): Promise<void> {
  log.info("monitor-contracts start");
  await database.connect();
  const blockchains = await database.Blockchain.find({});
  await Promise.all(
    blockchains.map(async (blockchain) => {
      const explorer = blockchain.explorer;
      const contractsVerified = await listContractsVerified(explorer);
      log.debug(`found ${contractsVerified.length} contracts on ${explorer}`);
      await Promise.all(
        contractsVerified.map(async (contractVerified) => {
          const contract: IContract = {
            blockchain: blockchain._id,
            address: contractVerified.Address,
            name: contractVerified["Contract Name"],
            compiler: contractVerified.Compiler,
            version: contractVerified.Version,
            balance: Number(contractVerified.Balance.replace(/ .*/, "")),
            txns: Number(contractVerified.Txns),
            setting: contractVerified.Setting,
            verified: parseDate(
              contractVerified.Verified,
              "M/dd/yyyy",
              new Date()
            ),
            audited: contractVerified.Audited,
            license: contractVerified.License,
          };

          const { address } = contract;

          await database.Contract.findOneAndUpdate(
            { address, explorer },
            contract,
            {
              new: true,
              upsert: true,
            }
          );
        })
      );
    })
  );
  log.info("monitor-contracts end");
}
