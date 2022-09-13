import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { Logger } from "tslog";
import generateSlitherReports from "./services/generate-slither-reports";
import monitorContracts from "./services/monitor-contracts";

const log = new Logger();

async function main(): Promise<void> {
  log.info("main start");
  await monitorContracts();
  await generateSlitherReports();
  log.info("main end");
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
