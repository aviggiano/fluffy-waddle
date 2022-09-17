import database, { Blockchain, connect, Contract, Report } from "../database";
import { Logger } from "tslog";
import { downloadSourceCode } from "../tools/explorer";
import md5sum from "../tools/md5";
import slither from "../tools/slither";
import { Tool } from "../tools";
import { findSolidityVersion, selectSolidityVersion } from "../tools/solc";
import { rm } from "fs/promises";

const tool: Tool = "slither";

const log = new Logger();

export default async function (): Promise<void> {
  log.info("generate-slither-reports start");
  await connect();
  const contracts = await database.manager.find(Contract);
  await Promise.all(
    contracts.map(async (contract) => {
      const { address } = contract;
      await downloadSourceCode(
        (contract.blockchain as unknown as Blockchain).explorer,
        address,
        `/tmp/${address}`
      );
      const md5 = await md5sum(`/tmp/${address}`);
      log.debug(`contract ${address} md5 ${md5}`);

      const report = await database.manager.find(Report, {
        where: {
          contract,
          md5,
        },
      });
      if (!report) {
        log.debug(`contract ${address} changed!`);
        const version = await findSolidityVersion(`/tmp/${address}`);
        await selectSolidityVersion(version);
        const details = await slither(`/tmp/${address}`);
        await Promise.all([
          database.manager.create(Report, {
            contract,
            md5,
            details,
            tool,
          }),
          rm(`/tmp/${address}`, { recursive: true }),
        ]);
      }
    })
  );
  log.info("generate-slither-reports end");
}