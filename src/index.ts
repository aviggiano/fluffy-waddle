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
import database, { IReport, IContract } from "./database";
import parseDate from "date-fns/parse";
import { Logger } from "tslog";
import { rm } from "fs/promises";

const log = new Logger();

async function main(): Promise<void> {
  const explorer: Explorer = "bscscan";

  await database.connect();
  const contractsVerified = await listContractsVerified(explorer, 1);
  log.debug(contractsVerified);
  for (const contractVerified of contractsVerified) {
    log.debug(contractVerified);
    const contract: IContract = {
      explorer,
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

    const { address } = contract;

    const contractDocument = await database.Contract.findOneAndUpdate(
      { address, explorer },
      contract,
      {
        new: true,
        upsert: true,
      }
    );

    await downloadSourceCode(explorer, address, `/tmp/${address}`);
    const md5 = await md5sum(`/tmp/${address}`);
    log.debug({ md5 });
    const report = await database.Report.findOne({
      contract: contractDocument._id,
      md5,
    });
    if (!report) {
      const version = await findSolidityVersion(`/tmp/${address}`);
      await selectSolidityVersion(version);
      const details = await runSlither(`/tmp/${address}`);
      await rm(`/tmp/${address}`, { recursive: true });
      await database.Report.create<IReport>({
        contract: contractDocument._id,
        md5,
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
    log.info(`Listening to port ${PORT}`);

    (function loop(): unknown {
      return Promise.resolve()
        .then(async () => {
          await main();
        })
        .catch((e) => log.error(e))
        .then(async () => {
          const timeout = 5 * 60e3;
          log.info(`Waiting ${timeout / 1e3} seconds`);
          await new Promise((resolve) => setTimeout(resolve, timeout));
          loop();
        });
    })();
  });
