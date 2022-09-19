import {
  ExplorerContractVerified,
  listContractsVerified,
} from "../tools/explorer";
import database, {
  Blockchain,
  connect,
  Contract,
  disconnect,
} from "../database";
import parseDate from "date-fns/parse";
import { Logger } from "tslog";

const log = new Logger();

function getContract(
  contractVerified: ExplorerContractVerified,
  blockchain: Blockchain
): Omit<Contract, "id" | "createdAt" | "updatedAt" | "blockchain"> & {
  blockchainId: number;
} {
  return {
    blockchainId: blockchain.id,
    address: contractVerified.Address,
    name: contractVerified["Contract Name"],
    compiler: contractVerified.Compiler,
    version: contractVerified.Version,
    balance: contractVerified.Balance.replace(/ .*/, ""),
    txns: Number(contractVerified.Txns),
    setting: contractVerified.Setting,
    verified: parseDate(contractVerified.Verified, "M/dd/yyyy", new Date()),
    audited: contractVerified.Audited,
    license: contractVerified.License,
  };
}

export async function main() {
  log.info("monitor-contracts start");
  await connect();
  await database.synchronize();

  const blockchains = await database.manager.find(Blockchain);

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
            await database
              .createQueryBuilder()
              .insert()
              .into(Contract)
              .values(contract)
              .orUpdate(
                Object.keys(contract).filter(
                  (e) => !["address", "blockchainId"].includes(e)
                ),
                ["address", "blockchainId"]
              )
              .execute();
          })
        );
      }
    })
  );
  log.info("monitor-contracts end");
  await disconnect();
}

export default {
  handler: "src/functions/monitor-contracts.main",
  maximumRetryAttempts: 0,
  events: [
    {
      schedule: {
        rate: ["rate(1 minute)"],
      },
    },
  ],
};
