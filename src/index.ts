import dotenv from "dotenv";
dotenv.config();
import express from "express";

import {
  downloadSourceCode,
  Explorer,
  listContractsVerified,
} from "./tools/explorer";
import { slither as runSlither } from "./tools/slither";
import { md5 as md5sum } from "./tools/md5";
import { findSolidityVersion, selectSolidityVersion } from "./tools/solc";
import database, { IReport } from "./database";
import { Logger } from "tslog";

const log = new Logger();

async function main(): Promise<void> {
  const explorer: Explorer = "bscscan";

  await database.connect();
  const contractsVerified = await listContractsVerified(explorer, 1);
  console.log(contractsVerified);
  for (const contractVerified of contractsVerified) {
    log.debug(contractVerified);

    const { Address: contract } = contractVerified;
    await downloadSourceCode(explorer, contract, `/tmp/${contract}`);
    const md5 = await md5sum(`/tmp/${contract}`);
    log.debug({ md5 });
    const report = await database.Report.findOne({ contract, explorer, md5 });
    if (!report) {
      const version = await findSolidityVersion(`/tmp/${contract}`);
      await selectSolidityVersion(version);
      const details = await runSlither(`/tmp/${contract}`);
      await database.Report.create<IReport>({
        contract,
        md5,
        explorer,
        details,
        tool: "slither",
      });
    }
  }
}

const PORT = process.env.PORT || 3000;
express()
  .get("/", (_req: any, res: any) => res.send({ success: true }))
  .listen(PORT, async () => {
    console.log(`Listening to port ${PORT}`);

    (function loop(): unknown {
      return Promise.resolve()
        .then(async () => {
          await main();
        })
        .catch((e) => console.error(e))
        .then(async () => {
          const timeout = 5 * 60e3;
          console.log(`Waiting ${timeout / 1e3} seconds`);
          await new Promise((resolve) => setTimeout(resolve, timeout));
          loop();
        });
    })();
  });
