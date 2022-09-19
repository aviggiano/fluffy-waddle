import database, { connect, Contract, Report } from "../database";
import { Logger } from "tslog";
import slither from "../tools/slither";
import { Tool } from "../tools";

const tool: Tool = "slither";

const log = new Logger();

export default async function (): Promise<void> {
  log.info("generate-slither-reports start");
  await connect();
  await database.synchronize();
  const contractsLength = await database.manager.count(Contract);
  const take = 20;
  for (let skip = 0; skip <= contractsLength; skip += take) {
    const contracts = await database.manager.find(Contract, { skip, take });
    log.info(`found ${contracts.length} contracts`);
    await Promise.all(
      contracts.map(async (contract) => {
        const reportExists = await database.manager.findOne(Report, {
          where: {
            contract,
            tool,
          },
        });
        if (reportExists) {
          log.debug(
            `report for contract ${contract.blockchain.caip}:${contract.address} already exists`
          );
          return;
        }

        log.debug(
          `run slither on ${contract.blockchain.caip}:${contract.address}`
        );
        const details = await slither(contract);
        await database.manager.save(Report, {
          contractId: contract.id,
          details,
          tool,
        });
      })
    );
  }
  log.info("generate-slither-reports end");
}
