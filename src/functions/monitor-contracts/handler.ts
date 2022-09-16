import {
  ExplorerContractVerified,
  listContractsVerified,
} from "../../tools/explorer";
import database, { Contract } from "../../database";
import parseDate from "date-fns/parse";
import { Logger } from "tslog";
import mongoose from "mongoose";

function getContract(
  contractVerified: ExplorerContractVerified,
  blockchain: { _id: mongoose.Types.ObjectId }
): Contract {
  return {
    blockchain: blockchain._id,
    address: contractVerified.Address,
    name: contractVerified["Contract Name"],
    compiler: contractVerified.Compiler,
    version: contractVerified.Version,
    balance: Number(contractVerified.Balance.replace(/ .*/, "")),
    txns: Number(contractVerified.Txns),
    setting: contractVerified.Setting,
    verified: parseDate(contractVerified.Verified, "M/dd/yyyy", new Date()),
    audited: contractVerified.Audited,
    license: contractVerified.License,
  };
}

export async function main() {
  const log = new Logger();
  log.info("monitor-contracts start");
  await database.connect();

  const blockchains = await database.Blockchain.find({}).exec();
  await Promise.all(
    blockchains.map(async (blockchain) => {
      const explorer = blockchain.explorer;
      const pages = 20;
      for (let page = 1; page <= pages; page++) {
        const contractsVerified = await listContractsVerified(explorer, page);
        log.debug(
          `found ${contractsVerified.length} contracts on page ${page} of ${explorer}`
        );
        await Promise.all(
          contractsVerified.map(async (contractVerified) => {
            const contract = getContract(contractVerified, blockchain);
            const { address } = contract;

            log.debug(
              `updating contract ${address} from ${blockchain.explorer}`
            );
            await database.Contract.findOneAndUpdate(
              { address, blockchain },
              contract,
              {
                new: true,
                upsert: true,
              }
            ).exec();
          })
        );
      }
    })
  );
  log.info("monitor-contracts end");
  await database.disconnect();
}
