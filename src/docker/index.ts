import generateSlitherReports from "./generate-slither-reports";
import { Logger } from "tslog";

const log = new Logger();

const timeout = 5 * 60e3;

async function main(): Promise<void> {
  await generateSlitherReports();
}

(function loop(): unknown {
  return Promise.resolve()
    .then(async () => {
      await main();
    })
    .catch((e) => log.error(e))
    .then(async () => {
      log.info(`Waiting ${timeout / 1e3} seconds`);
      await new Promise((resolve) => setTimeout(resolve, timeout));
      loop();
    });
})();
