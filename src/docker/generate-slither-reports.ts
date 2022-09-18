import database, { connect, Contract, Report } from "../database";
import { Logger } from "tslog";
import { downloadSourceCode, getContractDir } from "../tools/explorer";
import md5sum from "../tools/md5";
import slither from "../tools/slither";
import config from "../config";
import { Tool } from "../tools";
import { findSolidityVersion, selectSolidityVersion } from "../tools/solc";
import { rm } from "fs/promises";
import { MoreThan } from "typeorm";
import subDays from "date-fns/subDays";
import PromisePool from "@supercharge/promise-pool";

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
    const slitherContracts: {
      version: string;
      md5: string;
      dir: string;
      contract: Contract;
    }[] = [];
    const DOWNLOAD_CONCURRENCY = 20;
    await PromisePool.withConcurrency(DOWNLOAD_CONCURRENCY)
      .for(contracts)
      .process(async (contract) => {
        const reportExists = await database.manager.findOne(Report, {
          where: {
            contract,
            createdAt: MoreThan(subDays(new Date(), config.reports.maxAgeDays)),
          },
        });
        if (reportExists) {
          log.debug(
            `report for contract ${contract.blockchain.caip}:${contract.address} is not old enough`
          );
          return;
        }

        const dir = `/tmp/${contract.blockchain.caip}:${contract.address}`;

        await downloadSourceCode(
          contract.blockchain.explorer,
          contract.address,
          dir
        );
        const md5 = await md5sum(dir);
        log.debug(`contract ${contract.address} md5 ${md5}`);

        const report = await database.manager.findOne(Report, {
          where: {
            contract,
            md5,
          },
        });
        if (report) {
          log.debug(
            `report for contract ${contract.blockchain.caip}:${contract.address} with md5 ${md5} already exists`
          );
          return;
        }

        log.debug(
          reportExists
            ? `contract ${contract.blockchain.caip}:${contract.address} changed!`
            : `first report for ${contract.blockchain.caip}:${contract.address}`
        );
        const version = await findSolidityVersion(dir);
        slitherContracts.push({ version, md5, dir, contract });
      });

    log.info(`running slither on ${slitherContracts.length} contracts`);
    for (const { version, md5, dir, contract } of slitherContracts) {
      try {
        await selectSolidityVersion(version);
        const contractDir = await getContractDir(dir);
        log.debug(
          `run slither on ${contract.blockchain.caip}:${contract.address}`
        );
        const details = await slither(contractDir);
        await database.manager.save(Report, {
          contractId: contract.id,
          md5,
          details,
          tool,
        });
      } finally {
        rm(dir, { recursive: true });
      }
    }
  }
  log.info("generate-slither-reports end");
}
