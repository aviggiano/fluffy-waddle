import dotenv from "dotenv";
dotenv.config();

import database, { IBlockchain, IReport } from "../database";
import { Logger } from "tslog";
import { downloadSourceCode } from "../tools/explorer";
import md5sum from "../tools/md5";
import slither from "../tools/slither";
import { findSolidityVersion, selectSolidityVersion } from "../tools/solc";
import { rm } from "fs/promises";

const log = new Logger();

export default async function (): Promise<void> {
  log.info("generate-slither-reports start");
  await database.connect();
  const contracts = await database.Contract.find({}).populate("blockchain");
  await Promise.all(
    contracts.map(async (contract) => {
      const { address } = contract;
      await downloadSourceCode(
        (contract.blockchain as unknown as IBlockchain).explorer,
        address,
        `/tmp/${address}`
      );
      const md5 = await md5sum(`/tmp/${address}`);
      log.debug(`contract ${address} md5 ${md5}`);

      const report = await database.Report.findOne({
        contract: contract._id,
        md5,
      });
      if (!report) {
        log.debug(`contract ${address} changed!`);
        const version = await findSolidityVersion(`/tmp/${address}`);
        await selectSolidityVersion(version);
        const details = await slither(`/tmp/${address}`);
        await rm(`/tmp/${address}`, { recursive: true });
        await database.Report.create<IReport>({
          contract: contract._id,
          md5,
          details,
          tool: "slither",
        });
      }
    })
  );
  log.info("generate-slither-reports end");
}
