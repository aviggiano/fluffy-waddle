import database, {
  Blockchain,
  connect,
  Contract,
  disconnect,
  Report,
  Statistic,
} from "../database";
import { Logger } from "tslog";

const log = new Logger();

export async function main() {
  log.info("generate-statistics start");
  await connect();
  await database.synchronize();

  const [blockchains, contracts, reports] = await Promise.all([
    database.manager.count(Blockchain),
    database.manager.count(Contract),
    database.manager.count(Report),
  ]);

  await database.manager.save(Statistic, {
    blockchains,
    contracts,
    reports,
  });

  log.info("generate-statistics end");
  await disconnect();
}

export default {
  handler: "src/functions/generate-statistics.main",
  maximumRetryAttempts: 0,
  events: [
    {
      schedule: {
        rate: ["rate(1 day)"],
      },
    },
  ],
};
